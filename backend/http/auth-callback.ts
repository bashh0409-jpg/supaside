import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig } from "@/shared/supabase/config";
import { sendWelcomeEmail } from "@/backend/email/resend";

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

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("Supabase auth callback failed:", error.message);
    return NextResponse.redirect(
      new URL("/login?error=callback_failed", request.url),
    );
  }

  const shouldSendWelcomeEmail =
    request.nextUrl.searchParams.get("welcome") === "1";
  if (shouldSendWelcomeEmail) {
    if (!data.user?.email) {
      console.error("Verified signup has no email address for welcome email.");
      return NextResponse.redirect(
        new URL("/login?error=welcome_email_failed", request.url),
      );
    }

    try {
      await sendWelcomeEmail(data.user.email, data.user.id);
    } catch (error) {
      console.error("Unable to send the Supaside welcome email:", error);
      return NextResponse.redirect(
        new URL("/login?error=welcome_email_failed", request.url),
      );
    }

    const { error: metadataError } = await supabase.auth.updateUser({
      data: { signup_flow: null },
    });
    if (metadataError) {
      console.error(
        "Unable to clear the welcome-email signup marker:",
        metadataError.message,
      );
    }
  }

  return NextResponse.redirect(new URL("/", request.url));
}
