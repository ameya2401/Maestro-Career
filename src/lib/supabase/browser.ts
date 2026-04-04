"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "@/lib/supabase/config";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createBrowserSupabaseClient() {
    const { url, anonKey } = getSupabaseConfig();
    if (!url || !anonKey) {
        throw new Error("Supabase auth is not configured for the browser.");
    }

    if (!browserClient) {
        browserClient = createBrowserClient(url, anonKey, {
            auth: {
                persistSession: true,
                detectSessionInUrl: true,
                flowType: "implicit",
            },
        });
    }

    return browserClient;
}
