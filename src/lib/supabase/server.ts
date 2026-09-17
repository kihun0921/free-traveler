// @ts-expect-error - @supabase/ssr will be installed in AUTH-SUPABASE-SETUP
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase server client
 * Initialized from Next.js server components and Route Handlers
 * Uses anon key for RLS-based requests (respects user policies)
 * Can optionally use service role key for admin operations
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: Array<{
            name: string;
            value: string;
            options: Record<string, unknown>;
          }>,
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(
                name,
                value,
                options as Parameters<typeof cookieStore.set>[2],
              ),
            );
          } catch {
            // silently ignore
          }
        },
      },
    },
  );
}

/**
 * Supabase admin client (with service role key)
 * Use only for admin operations that bypass RLS
 * NEVER expose service role key to client
 * Only call from server-side code
 *
 * Note: Actual implementation will use @supabase/supabase-js
 * which will be installed in AUTH-SUPABASE-SETUP task
 */
export async function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  // Dynamic import to avoid loading in client context
  // @ts-expect-error - module installed in AUTH-SUPABASE-SETUP
  const { createClient: createSupabaseClient } =
    await import("@supabase/supabase-js");

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
  );
}
