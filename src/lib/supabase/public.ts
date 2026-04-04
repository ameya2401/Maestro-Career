import { createClient } from "@supabase/supabase-js";
import { assertSupabaseConfigured } from "@/lib/supabase/config";

export function createPublicServerClient() {
    const { url, anonKey } = assertSupabaseConfigured();

    return createClient(url, anonKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
        },
    });
}
