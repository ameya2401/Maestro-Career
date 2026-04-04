import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { assertSupabaseConfigured } from "@/lib/supabase/config";

type PendingCookie = {
    value: string;
    options?: Parameters<NextResponse["cookies"]["set"]>[2];
};

export function createRouteHandlerClient(request: NextRequest) {
    const { url, anonKey } = assertSupabaseConfigured();
    const pendingCookies = new Map<string, PendingCookie>();

    const supabase = createServerClient(url, anonKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) => {
                    // Update the request cookies so subsequent supabase calls see the new values
                    request.cookies.set(name, value);
                    // Store for the response
                    pendingCookies.set(name, { value, options });
                });
            },
        },
    });

    return {
        supabase,
        applyToResponse(response: NextResponse) {
            pendingCookies.forEach((cookie, name) => {
                response.cookies.set(name, cookie.value, cookie.options);
            });
            response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
            return response;
        },
    };
}
