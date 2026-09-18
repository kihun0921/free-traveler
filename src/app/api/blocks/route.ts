import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

interface BlockInsert {
  blocked_id: string;
}

interface Block {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user?.profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: BlockInsert = await request.json();

    if (!body.blocked_id) {
      return NextResponse.json(
        { error: "blocked_id is required" },
        { status: 400 },
      );
    }

    if (body.blocked_id === user.id) {
      return NextResponse.json(
        { error: "Cannot block yourself" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("user_block")
      .insert({
        blocker_id: user.id,
        blocked_id: body.blocked_id,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "User is already blocked" },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { error: "Failed to create block" },
        { status: 500 },
      );
    }

    const block: Block = data;

    return NextResponse.json(block, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user?.profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("user_block")
      .select("*")
      .eq("blocker_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch blocks" },
        { status: 500 },
      );
    }

    return NextResponse.json(data || [], { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
