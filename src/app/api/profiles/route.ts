import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface ProfilesRequest {
  user_ids: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: ProfilesRequest = await request.json();

    if (!Array.isArray(body.user_ids) || body.user_ids.length === 0) {
      return NextResponse.json([]);
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("user_profile")
      .select("id,nickname,age_group,gender,travel_style")
      .in("id", body.user_ids);

    if (error) {
      console.error("[api/profiles POST] Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch profiles" },
        { status: 500 },
      );
    }

    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
