import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

interface ReportInsert {
  target_type: string;
  target_id: string;
  reason: string;
}

interface Report {
  id: string;
  reporter_id: string;
  target_type: string;
  target_id: string;
  reason: string;
  status: "OPEN" | "RESOLVED" | "DISMISSED";
  created_at: string;
  updated_at: string;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user?.profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: ReportInsert = await request.json();

    if (!body.target_type || !body.target_id || !body.reason) {
      return NextResponse.json(
        { error: "target_type, target_id, and reason are required" },
        { status: 400 },
      );
    }

    if (typeof body.reason !== "string" || body.reason.trim().length === 0) {
      return NextResponse.json(
        { error: "Reason cannot be empty" },
        { status: 400 },
      );
    }

    if (body.reason.length > 500) {
      return NextResponse.json(
        { error: "Reason must be 500 characters or less" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("report")
      .insert({
        id: randomUUID(),
        reporter_id: user.id,
        target_type: body.target_type,
        target_id: body.target_id,
        reason: body.reason,
        status: "OPEN",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create report" },
        { status: 500 },
      );
    }

    const report: Report = data;

    return NextResponse.json(report, { status: 201 });
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
      .from("report")
      .select("*")
      .eq("reporter_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch reports" },
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
