import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { NextResponse } from "next/server";

interface OutboundSettings {
  flight_outbound_url: string;
  hotel_outbound_url: string;
}

function validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Only allow HTTPS
    if (parsed.protocol !== "https:") {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!isAdminEmail(user.email)) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("app_setting")
      .select("key,value")
      .in("key", ["flight_outbound_url", "hotel_outbound_url"]);

    if (!data || error) {
      return NextResponse.json(
        { error: "Failed to fetch settings" },
        { status: 500 },
      );
    }

    const settings: Record<string, string> = {};
    data.forEach((item: { key: string; value: string }) => {
      settings[item.key] = item.value;
    });

    return NextResponse.json({
      flight_outbound_url: settings.flight_outbound_url || "",
      hotel_outbound_url: settings.hotel_outbound_url || "",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!isAdminEmail(user.email)) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    const body: Partial<OutboundSettings> = await request.json();

    // Validate URLs
    if (body.flight_outbound_url) {
      if (!validateUrl(body.flight_outbound_url)) {
        return NextResponse.json(
          { error: "flight_outbound_url must be a valid HTTPS URL" },
          { status: 400 },
        );
      }
    }

    if (body.hotel_outbound_url) {
      if (!validateUrl(body.hotel_outbound_url)) {
        return NextResponse.json(
          { error: "hotel_outbound_url must be a valid HTTPS URL" },
          { status: 400 },
        );
      }
    }

    const supabase = await createClient();

    // Update each setting
    const updates: Array<Promise<void>> = [];

    if (body.flight_outbound_url) {
      updates.push(
        (async () => {
          const { error } = await supabase.from("app_setting").upsert(
            {
              key: "flight_outbound_url",
              value: body.flight_outbound_url,
            },
            { onConflict: "key" },
          );
          if (error) {
            throw error;
          }
        })(),
      );
    }

    if (body.hotel_outbound_url) {
      updates.push(
        (async () => {
          const { error } = await supabase.from("app_setting").upsert(
            {
              key: "hotel_outbound_url",
              value: body.hotel_outbound_url,
            },
            { onConflict: "key" },
          );
          if (error) {
            throw error;
          }
        })(),
      );
    }

    try {
      await Promise.all(updates);
    } catch {
      return NextResponse.json(
        { error: "Failed to update settings" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
