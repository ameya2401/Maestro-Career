import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
    return NextResponse.json(
        {
            success: false,
            message: "Password recovery now uses an email reset link instead of OTP verification.",
        },
        { status: 410 }
    );
}
