import { createClient } from "@/lib/supabase/server";
import { createUserProfile } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  const supabase = await createClient();

  try {
    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      throw new Error(exchangeError.message);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      throw new Error("No user email found after exchange");
    }

    const { data: existingProfile } = await supabase
      .from("user_profile")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!existingProfile) {
      await createUserProfile(user.id, user.email);
    }
  } catch {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.redirect(new URL("/", request.url));
}
