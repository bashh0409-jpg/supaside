import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig } from "@/shared/supabase/config";

function subtractSixCalendarMonths(date: Date) {
  const result = new Date(date);
  const day = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() - 6);
  const lastDay = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0),
  ).getUTCDate();
  result.setUTCDate(Math.min(day, lastDay));
  return result.toISOString();
}

export async function DELETE(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const config = getSupabaseConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!config || !serviceRoleKey) {
    console.error("Account deletion is not configured on the server.");
    return NextResponse.json(
      { error: "Account deletion is unavailable. Please try again later." },
      { status: 503 },
    );
  }

  const cookieStore = await cookies();
  const sessionClient = createServerClient(config.url, config.key, {
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

  const {
    data: { user },
    error: userError,
  } = await sessionClient.auth.getUser();
  if (userError || !user) {
    return NextResponse.json(
      { error: "Sign in again before deleting your account." },
      { status: 401 },
    );
  }

  const adminClient = createClient(config.url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: recentOrder, error: orderError } = await adminClient
    .from("orders")
    .select("id")
    .eq("user_id", user.id)
    .gte("created_at", subtractSixCalendarMonths(new Date()))
    .limit(1)
    .maybeSingle();
  if (orderError) {
    console.error("Unable to check order retention before account deletion:", orderError);
    return NextResponse.json(
      { error: "Unable to verify your order history. Please try again." },
      { status: 500 },
    );
  }
  if (recentOrder) {
    return NextResponse.json(
      {
        error:
          "Your account cannot be deleted until six months have passed since your latest order.",
      },
      { status: 409 },
    );
  }

  const { error: deleteError } = await adminClient.auth.admin.deleteUser(
    user.id,
  );
  if (deleteError) {
    console.error("Unable to delete the Supabase account:", deleteError);
    if (deleteError.code === "23503") {
      return NextResponse.json(
        {
          error:
            "Your account has records that need to be retained. Please contact support to complete deletion.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Unable to delete your account. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
