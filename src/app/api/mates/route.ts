import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

interface MatePostInsert {
  title: string;
  country: string;
  region?: string;
  start_date: string;
  end_date: string;
  people_count: number;
  conditions?: string;
  description: string;
  safety_agreed_at?: string;
  policy_version?: string;
}

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

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: MatePostInsert = await request.json();

    if (
      !body.title ||
      !body.country ||
      !body.start_date ||
      !body.end_date ||
      !body.people_count ||
      !body.description
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const start = new Date(body.start_date);
    const end = new Date(body.end_date);
    const now = new Date();

    if (start < now) {
      return NextResponse.json(
        { error: "Start date cannot be in the past" },
        { status: 400 },
      );
    }

    if (end <= start) {
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 },
      );
    }

    if (body.people_count < 1) {
      return NextResponse.json(
        { error: "People count must be at least 1" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("mate_post")
      .insert({
        user_id: user.id,
        title: body.title,
        country: body.country,
        region: body.region,
        start_date: body.start_date,
        end_date: body.end_date,
        people_count: body.people_count,
        conditions: body.conditions,
        description: body.description,
        status: "OPEN",
        safety_agreed_at: body.safety_agreed_at,
        policy_version: body.policy_version,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create mate post" },
        { status: 500 },
      );
    }

    const post: MatePost = {
      ...data,
      status: derivedStatus(data.end_date),
    };

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const country = searchParams.get("country");
    const region = searchParams.get("region");
    const startDateParam = searchParams.get("start_date");
    const endDateParam = searchParams.get("end_date");

    const supabase = await createClient();

    let query = supabase
      .from("mate_post")
      .select(
        "id,user_id,title,country,region,start_date,end_date,people_count,conditions,description,status,safety_agreed_at,policy_version,created_at,updated_at",
      )
      .order("created_at", { ascending: false });

    if (country) {
      query = query.eq("country", country);
    }

    if (region) {
      query = query.eq("region", region);
    }

    if (startDateParam) {
      query = query.gte("start_date", startDateParam);
    }

    if (endDateParam) {
      query = query.lte("end_date", endDateParam);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch mate posts" },
        { status: 500 },
      );
    }

    const posts: MatePost[] = (data || []).map((post) => ({
      ...post,
      status: derivedStatus(post.end_date),
    }));

    return NextResponse.json(posts);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
