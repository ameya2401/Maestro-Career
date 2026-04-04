import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

export async function updateSession(request: NextRequest) {
    const { url, anonKey } = getSupabaseConfig();
    if (!url || !anonKey) {
        return NextResponse.next({ request });
    }

    let response = NextResponse.next({ request });

    const supabase = createServerClient(url, anonKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) => {
                    request.cookies.set(name, value);
                });

                response = NextResponse.next({ request });
                cookiesToSet.forEach(({ name, value, options }) => {
                    response.cookies.set(name, value, options);
                });
            },
        },
    });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;
    const isRecoveryMode = pathname === "/auth" && request.nextUrl.searchParams.get("recovery") === "1";

    if (pathname.startsWith("/dashboard") && !user) {
        return NextResponse.redirect(new URL("/auth", request.url));
    }

    if (pathname === "/auth" && user && !isRecoveryMode) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    response.headers.set("Cache-Control", "private, no-store");
    return response;
}
