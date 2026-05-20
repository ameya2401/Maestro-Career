import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const adminApiPublicPaths = [
        "/api/admin/login",
        "/api/admin/logout",
        "/api/admin/session",
    ];

    const isProtectedAdminPage = pathname.startsWith("/admin/dashboard");
    const isProtectedAdminApi = pathname.startsWith("/api/admin") && !adminApiPublicPaths.includes(pathname);

    if (isProtectedAdminPage || isProtectedAdminApi) {
        const hasAdminSession = request.cookies.get(ADMIN_SESSION_COOKIE)?.value === "authorized";

        if (!hasAdminSession) {
            if (isProtectedAdminApi) {
                return NextResponse.json({ success: false, message: "Admin authentication required." }, { status: 401 });
            }

            const url = request.nextUrl.clone();
            url.pathname = "/admin";
            return NextResponse.redirect(url);
        }
    }

    return updateSession(request);
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/auth/:path*",
        "/login",
        "/register",
<<<<<<< HEAD
        "/admin/:path*",
        "/api/admin/:path*",
        "/test/:path*",
        "/api/test/:path*",
=======
        "/test/:path*",
        "/api/test/:path*",
        "/admin/:path*",
        "/api/admin/:path*",
>>>>>>> 859efa387dd4ad028b63e0a6f0699b8c2717116d
    ],
};
