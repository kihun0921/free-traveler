import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user?.profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    const block = await supabase
      .from("user_block")
      .select("blocker_id")
      .eq("id", id)
      .single();

    if (block.error || !block.data) {
      return NextResponse.json(
        { error: "Block not found" },
        { status: 404 },
      );
    }

    if (block.data.blocker_id !== user.id) {
      return NextResponse.json(
        { error: "You can only delete your own blocks" },
        { status: 403 },
      );
    }

    const { error } = await supabase
      .from("user_block")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete block" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
