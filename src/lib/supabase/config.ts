const DEFAULT_APP_URL = "http://localhost:3000";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

function resolveAppUrl() {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() ?? "";

    if (appUrl) {
        return appUrl;
    }

    if (IS_PRODUCTION) {
        return "";
    }

    return DEFAULT_APP_URL;
}

export function getSupabaseConfig() {
    return {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "",
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "",
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "",
        appUrl: resolveAppUrl(),
    };
}

export function getSupabaseConfigError() {
    const { url, anonKey, serviceRoleKey, appUrl } = getSupabaseConfig();
    const missing: string[] = [];

    if (!url) {
        missing.push("NEXT_PUBLIC_SUPABASE_URL");
    }
    if (!anonKey) {
        missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }
    if (!serviceRoleKey) {
        missing.push("SUPABASE_SERVICE_ROLE_KEY");
    }
    if (IS_PRODUCTION && !appUrl) {
        missing.push("NEXT_PUBLIC_APP_URL");
    }

    if (missing.length === 0) {
        return null;
    }

    return `Supabase auth is not configured. Missing: ${missing.join(", ")}.`;
}

export function assertSupabaseConfigured() {
    const error = getSupabaseConfigError();
    if (error) {
        throw new Error(error);
    }

    return getSupabaseConfig();
}
