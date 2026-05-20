import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const supabase = createAdminClient();
        const userId = params.userId;
        const { searchParams } = new URL(req.url);
        const action = searchParams.get('action') || 'grant'; // grant or revoke

        if (action === 'grant') {
            const { error } = await supabase
                .from('assessment_access_grants')
                .upsert({
                    user_id: userId,
                    bank_version: 'prototype-1-v1',
                    status: 'granted'
                }, { onConflict: 'user_id,bank_version' });

            if (error) throw error;
            return NextResponse.json({ success: true, message: "Internal assessment access granted." });
        } else {
            const { error } = await supabase
                .from('assessment_access_grants')
                .update({ status: 'revoked' })
                .match({ user_id: userId, bank_version: 'prototype-1-v1' });

            if (error) throw error;
            return NextResponse.json({ success: true, message: "Internal assessment access revoked." });
        }

    } catch (error: any) {
        console.error('Grant Access Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
