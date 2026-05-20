import { createRouteHandlerClient } from "@/lib/supabase/route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { supabase } = createRouteHandlerClient(req);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        // Check for active grant
        const { data: grant, error: grantError } = await supabase
            .from('assessment_access_grants')
            .select('*')
            .eq('user_id', user.id)
            .eq('bank_version', 'prototype-1-v1')
            .single();

        // Check for active attempt
        const { data: attempt, error: attemptError } = await supabase
            .from('assessment_attempts')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single();

        return NextResponse.json({
            authenticated: true,
            hasAccess: grant?.status === 'granted',
            grantStatus: grant?.status || 'pending',
            activeAttempt: attempt || null
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
