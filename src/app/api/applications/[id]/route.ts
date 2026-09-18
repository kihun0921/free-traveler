import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

interface ApplicationUpdate {
  status: "ACCEPTED" | "REJECTED";
}

interface Application {
  id: string;
  post_id: string;
  user_id: string;
  message: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  created_at: string;
  updated_at: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user?.profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: ApplicationUpdate = await request.json();

    if (!body.status || !["ACCEPTED", "REJECTED"].includes(body.status)) {
      return NextResponse.json(
        { error: "Status must be ACCEPTED or REJECTED" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const { data: application, error: appError } = await supabase
      .from("mate_application")
      .select("post_id")
      .eq("id", id)
      .single();

    if (appError || !application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    const { data: post, error: postError } = await supabase
      .from("mate_post")
      .select("user_id")
      .eq("id", application.post_id)
      .single();

    if (postError || !post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 },
      );
    }

    if (post.user_id !== user.id) {
      return NextResponse.json(
        { error: "Only the post creator can update applications" },
        { status: 403 },
      );
    }

    const { data, error } = await supabase
      .from("mate_application")
      .update({
        status: body.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update application" },
        { status: 500 },
      );
    }

    const updatedApplication: Application = data;

    return NextResponse.json(updatedApplication);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
