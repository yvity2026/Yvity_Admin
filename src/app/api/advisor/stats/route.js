import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { apiResponse } from "@/lib/apiResponse";
import { getUser } from "@/lib/auth/Getuser";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const user = await getUser();
    const now = new Date();
    const last7 = new Date(now);
    last7.setDate(now.getDate() - 7);

    const last14 = new Date(now);
    last14.setDate(now.getDate() - 14);

    //  last 7 days
    const { data: current } = await supabase
      .from("advisor_profile_stats")
      .select("stats_type")
      .gte("created_at", last7.toISOString());

    //  previous 7 days
    const { data: previous } = await supabase
      .from("advisor_profile_stats")
      .select("stats_type")
      .gte("created_at", last14.toISOString())
      .lt("created_at", last7.toISOString());

    function groupCount(data) {
      const map = {};

      data?.forEach((item) => {
        map[item.stats_type] = (map[item.stats_type] || 0) + 1;
      });

      return map;
    }

    const currentMap = groupCount(current || []);
    const previousMap = groupCount(previous || []);

    function growth(current, prev) {
      if (!prev) return current > 0 ? 100 : 0;
      return ((current - prev) / prev) * 100;
    }

    const result = [
      {
        label: "Profile Views",
        value: currentMap.view || 0,
        growth: `${growth(currentMap.view || 0, previousMap.view || 0).toFixed(
          1,
        )}%`,
        type: "percent",
      },{

          label: "Testimonials",
        value: currentMap.view || 0,
        growth: `${growth(currentMap.view || 0, previousMap.view || 0).toFixed(
          1,
        )}%`,
        type: "percent",
      },
      {
        label: "Recommendations",
        value: currentMap.share || 0,
        growth: `${growth(
          currentMap.share || 0,
          previousMap.share || 0,
        ).toFixed(1)}%`,
        type: "percent",
      },
      {
        label: "Profile Shares",
        value: currentMap.contact || 0,
        growth: `${growth(
          currentMap.contact || 0,
          previousMap.contact || 0,
        ).toFixed(1)}%`,
        type: "percent",
      },
    ];

    return NextResponse.json(result);
  } catch (error) {
    return apiResponse();
  }
}
