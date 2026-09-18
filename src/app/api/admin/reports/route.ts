import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

interface ReportUpdate {
  status?: "OPEN" | "RESOLVED" | "DISMISSED";
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

async function isAdmin(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_profile")
    .select("email")
    .eq("id", userId)
    .single();

  return data?.email?.endsWith("@admin.traveler.local") || false;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user?.profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await isAdmin(user.id);
    if (!admin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    const url = new URL(request.url);
    const status = url.searchParams.get("status");

    const supabase = await createClient();

    let query = supabase.from("report").select("*");

    if (status && ["OPEN", "RESOLVED", "DISMISSED"].includes(status)) {
      query = query.eq("status", status);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

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

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user?.profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await isAdmin(user.id);
    if (!admin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    const url = new URL(request.url);
    const reportId = url.searchParams.get("id");

    if (!reportId) {
      return NextResponse.json(
        { error: "Report ID is required" },
        { status: 400 },
      );
    }

    const body: ReportUpdate = await request.json();

    if (!body.status || !["OPEN", "RESOLVED", "DISMISSED"].includes(body.status)) {
      return NextResponse.json(
        { error: "Valid status (OPEN, RESOLVED, DISMISSED) is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("report")
      .update({ status: body.status, updated_at: new Date().toISOString() })
      .eq("id", reportId)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Report not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(
        { error: "Failed to update report" },
        { status: 500 },
      );
    }

    const report: Report = data;

    return NextResponse.json(report, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
