import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticatedRequest } from "@/lib/admin-auth";
import { INTERNAL_BANK_VERSION_V1 } from "@/lib/assessment/bank";

export const runtime = "nodejs";

type PaymentStatus = "paid" | "unpaid";

type GrantRow = {
    id: string;
    user_id: string;
    bank_version: string;
    status: "active" | "revoked";
    granted_at: string;
    granted_by: string;
    revoked_at: string | null;
    revoked_by: string | null;
    notes: string | null;
};

type AttemptRow = {
    id: string;
    user_id: string;
    bank_version: string;
    status: "in_progress" | "submitted" | "expired";
    started_at: string;
    expires_at: string;
    submitted_at: string | null;
    created_at: string;
};

async function loadState(admin: ReturnType<typeof createAdminClient>, userId: string) {
    const { data: profile, error: profileError } = await admin
        .from("profiles")
        .select("payment_status")
        .eq("id", userId)
        .maybeSingle();

    if (profileError) throw profileError;

    const { data: grant, error: grantError } = await admin
        .from("assessment_access_grants")
        .select("id,user_id,bank_version,status,granted_at,granted_by,revoked_at,revoked_by,notes")
        .eq("user_id", userId)
        .eq("bank_version", INTERNAL_BANK_VERSION_V1)
        .maybeSingle();

    if (grantError) throw grantError;

    const { data: latestAttempt, error: attemptError } = await admin
        .from("assessment_attempts")
        .select("id,user_id,bank_version,status,started_at,expires_at,submitted_at,created_at")
        .eq("user_id", userId)
        .eq("bank_version", INTERNAL_BANK_VERSION_V1)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (attemptError) throw attemptError;

    const resultId = latestAttempt
        ? (
            await admin
                .from("assessment_results")
                .select("id")
                .eq("attempt_id", (latestAttempt as AttemptRow).id)
                .maybeSingle()
        ).data?.id ?? null
        : null;

    return {
        paymentStatus: ((profile as { payment_status: PaymentStatus | null } | null)?.payment_status ?? null),
        grant: (grant as GrantRow | null) ?? null,
        latestAttempt: (latestAttempt as AttemptRow | null) ?? null,
        latestResultId: resultId,
    };
}

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        if (!isAdminAuthenticatedRequest(req)) {
            return NextResponse.json({ success: false, message: "Admin authentication required." }, { status: 401 });
        }

        const admin = createAdminClient();
        const state = await loadState(admin, params.userId);

        return NextResponse.json({ success: true, data: state });
    } catch (error) {
        console.error("Admin Load State Error:", error);
        const message = error instanceof Error ? error.message : "Unable to load assessment access.";
        return NextResponse.json({ success: false, message }, { status: 400 });
    }
}

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        if (!isAdminAuthenticatedRequest(req)) {
            return NextResponse.json({ success: false, message: "Admin authentication required." }, { status: 401 });
        }

        type ActionBody = { action?: "grant" | "revoke" };
        let body: ActionBody = {};
        try {
            body = (await req.json()) as ActionBody;
        } catch {
            body = {};
        }

        const action = body?.action === "revoke" ? "revoke" : "grant";

        const admin = createAdminClient();
        const state = await loadState(admin, params.userId);

        if (action === "grant") {
            // REMOVED: strict "paid" check. As an admin, you should be able to grant access regardless of database payment status.
            // This allows for free access grants or trial periods manually issued by admin.

            const now = new Date().toISOString();
            const { error } = await admin
                .from("assessment_access_grants")
                .upsert(
                    {
                        user_id: params.userId,
                        bank_version: INTERNAL_BANK_VERSION_V1,
                        status: "active",
                        granted_at: now,
                        granted_by: "admin",
                        revoked_at: null,
                        revoked_by: null,
                    },
                    { onConflict: "user_id,bank_version" },
                );

            if (error) throw error;
        } else {
            const { error } = await admin
                .from("assessment_access_grants")
                .update({
                    status: "revoked",
                    revoked_at: new Date().toISOString(),
                    revoked_by: "admin",
                })
                .eq("user_id", params.userId)
                .eq("bank_version", INTERNAL_BANK_VERSION_V1);

            if (error) throw error;
        }

        const refreshed = await loadState(admin, params.userId);
        return NextResponse.json({ success: true, data: refreshed });
    } catch (error) {
        console.error("Admin Grant Access Error:", error);
        const message = error instanceof Error ? error.message : "Unable to update assessment access.";
        return NextResponse.json({ success: false, message }, { status: 400 });
    }
}
