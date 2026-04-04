import { createClient } from "@supabase/supabase-js";
import { assertSupabaseConfigured } from "@/lib/supabase/config";

export function createAdminClient() {
    const { url, serviceRoleKey } = assertSupabaseConfigured();

    return createClient(url, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
