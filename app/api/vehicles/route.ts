import { NextRequest, NextResponse } from "next/server";
import { getAvailableVehicles } from "@/lib/services/vehicles";

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get("type");
    
    // TODO: Get vehicles based on type filter
    const vehicles = await getAvailableVehicles();

    return NextResponse.json({ vehicles, success: true });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}
