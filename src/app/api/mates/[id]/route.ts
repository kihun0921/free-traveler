import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

interface MatePost {
  id: string;
  user_id: string;
  title: string;
  country: string;
  region?: string;
  start_date: string;
  end_date: string;
  people_count: number;
  conditions?: string;
  description: string;
  status: "OPEN" | "CLOSED";
  safety_agreed_at?: string;
  policy_version?: string;
  created_at: string;
  updated_at: string;
}

function derivedStatus(endDate: string): "OPEN" | "CLOSED" {
  const today = new Date();
  const end = new Date(endDate);
  return end < today ? "CLOSED" : "OPEN";
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("mate_post")
      .select(
        "id,user_id,title,country,region,start_date,end_date,people_count,conditions,description,status,safety_agreed_at,policy_version,created_at,updated_at",
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Mate post not found" }, { status: 404 });
    }

    const post: MatePost = {
      ...data,
      status: derivedStatus(data.end_date),
    };

    return NextResponse.json(post);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getCurrentUser();
    if (!user?.profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body: Partial<MatePost> = await request.json();

    const supabase = await createClient();

    const { data: existing, error: fetchError } = await supabase
      .from("mate_post")
      .select("user_id,end_date")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Mate post not found" }, { status: 404 });
    }

    if (existing.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const derivedStatusValue = derivedStatus(existing.end_date);
    if (derivedStatusValue === "CLOSED") {
      return NextResponse.json(
        { error: "Cannot update a closed mate post" },
        { status: 400 },
      );
    }

    const updateData: Record<string, unknown> = {};

    if (body.title) updateData.title = body.title;
    if (body.country) updateData.country = body.country;
    if (body.region !== undefined) updateData.region = body.region;
    if (body.start_date) updateData.start_date = body.start_date;
    if (body.end_date) updateData.end_date = body.end_date;
    if (body.people_count) updateData.people_count = body.people_count;
    if (body.conditions !== undefined) updateData.conditions = body.conditions;
    if (body.description) updateData.description = body.description;
    if (body.safety_agreed_at !== undefined)
      updateData.safety_agreed_at = body.safety_agreed_at;
    if (body.policy_version !== undefined)
      updateData.policy_version = body.policy_version;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("mate_post")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update mate post" },
        { status: 500 },
      );
    }

    const post: MatePost = {
      ...data,
      status: derivedStatus(data.end_date),
    };

    return NextResponse.json(post);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getCurrentUser();
    if (!user?.profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const supabase = await createClient();

    const { data: existing, error: fetchError } = await supabase
      .from("mate_post")
      .select("user_id,end_date")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Mate post not found" }, { status: 404 });
    }

    if (existing.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const derivedStatusValue = derivedStatus(existing.end_date);
    if (derivedStatusValue === "CLOSED") {
      return NextResponse.json(
        { error: "Cannot delete a closed mate post" },
        { status: 400 },
      );
    }

    const { error } = await supabase.from("mate_post").delete().eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete mate post" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true }, { status: 204 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
