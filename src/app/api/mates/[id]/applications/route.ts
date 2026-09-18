import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

interface ApplicationInsert {
  message: string;
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user?.profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: ApplicationInsert = await request.json();

    if (!body.message || typeof body.message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    if (body.message.length > 500) {
      return NextResponse.json(
        { error: "Message must be 500 characters or less" },
        { status: 400 },
      );
    }

    if (body.message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("mate_application")
      .insert({
        post_id: id,
        user_id: user.id,
        message: body.message,
        status: "PENDING",
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "You already have an application for this post" },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { error: "Failed to create application" },
        { status: 500 },
      );
    }

    const application: Application = data;

    return NextResponse.json(application, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(
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

    const { data: post, error: postError } = await supabase
      .from("mate_post")
      .select("user_id")
      .eq("id", id)
      .single();

    if (postError || !post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 },
      );
    }

    if (post.user_id !== user.id) {
      return NextResponse.json(
        { error: "You can only view applications for your own posts" },
        { status: 403 },
      );
    }

    const { data, error } = await supabase
      .from("mate_application")
      .select("*")
      .eq("post_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch applications" },
        { status: 500 },
      );
    }

    const applications: Application[] = data || [];

    return NextResponse.json(applications);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
