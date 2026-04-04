import { createClient } from "@supabase/supabase-js";

function requiredEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

async function main() {
    const url = requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
    const serviceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");

    const supabase = createClient(url, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });

    let page = 1;
    let deletedUsers = 0;

    while (true) {
        const { data, error: listError } = await supabase.auth.admin.listUsers({
            page,
            perPage: 1000,
        });

        if (listError) {
            throw new Error(listError.message);
        }

        const users = data?.users ?? [];
        for (const user of users) {
            const { error } = await supabase.auth.admin.deleteUser(user.id);
            if (error) {
                throw new Error(`Failed to delete auth user ${user.id}: ${error.message}`);
            }

            deletedUsers += 1;
        }

        if (users.length < 1000) {
            break;
        }

        page += 1;
    }

    const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");
    if (profileError) {
        throw new Error(`Failed to clear profiles: ${profileError.message}`);
    }

    const { error: activityError } = await supabase
        .from("auth_activity")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");
    if (activityError) {
        throw new Error(`Failed to clear auth activity: ${activityError.message}`);
    }

    console.log(`Deleted ${deletedUsers} auth users and cleared profiles/activity tables.`);
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
