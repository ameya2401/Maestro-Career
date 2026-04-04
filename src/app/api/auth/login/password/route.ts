import { NextRequest, NextResponse } from "next/server";
import { loginWithPassword } from "@/lib/auth-supabase";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";
import { createRouteHandlerClient } from "@/lib/supabase/route";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const ip = getClientIp(req.headers);
        const ipRate = consumeRateLimit({
            key: `auth:login:password:ip:${ip}`,
            limit: 40,
            windowMs: 15 * 60 * 1000,
        });
        if (!ipRate.ok) {
            return NextResponse.json(
                { success: false, message: "Too many login attempts. Try again later." },
                { status: 429, headers: { "Retry-After": String(ipRate.retryAfterSeconds) } }
            );
        }

        const body = await req.json();
        const email = String(body?.email ?? body?.identifier ?? "").trim().toLowerCase();
        if (email) {
            const identifierRate = consumeRateLimit({
                key: `auth:login:password:identifier:${email}`,
                limit: 12,
                windowMs: 15 * 60 * 1000,
            });
            if (!identifierRate.ok) {
                return NextResponse.json(
                    { success: false, message: "Too many login attempts. Try again later." },
                    { status: 429, headers: { "Retry-After": String(identifierRate.retryAfterSeconds) } }
                );
            }
        }

        const { supabase, applyToResponse } = createRouteHandlerClient(req);
        const result = await loginWithPassword(supabase, {
            email: body?.email ?? body?.identifier ?? "",
            password: body?.password ?? "",
        });

        return applyToResponse(NextResponse.json({
            success: true,
            message: "Login successful.",
            user: result.user,
        }));
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to login with password.";
        const status = message.includes("Supabase auth is not configured") ? 503 : 400;
        return NextResponse.json({ success: false, message }, { status });
    }
}
