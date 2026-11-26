import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig } from "../../lib/supabase/config";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=callback_failed", request.url),
    );
  }

  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.redirect(
      new URL("/login?error=auth_not_configured", request.url),
    );
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(config.url, config.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("Supabase auth callback failed:", error.message);
    return NextResponse.redirect(
      new URL("/login?error=callback_failed", request.url),
    );
  }

  return NextResponse.redirect(new URL("/", request.url));
}
