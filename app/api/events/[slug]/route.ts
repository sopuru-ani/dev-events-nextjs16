import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * GET /api/events/[slug]
 * Returns a single event by its unique slug.
 */
export async function GET(_req: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { slug } = await params;

    // Validate slug presence and basic format
    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { msg: "A valid slug parameter is required" },
        { status: 400 }
      );
    }

    // Optional: enforce a conservative slug pattern (lowercase, digits, hyphens)
    const slugPattern = /^[a-z0-9-]+$/;
    if (!slugPattern.test(slug)) {
      return NextResponse.json(
        { msg: "Slug format is invalid" },
        { status: 400 }
      );
    }

    await connectDB();

    const event = await Event.findOne({ slug }).lean().exec();

    if (!event) {
      return NextResponse.json(
        { msg: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { msg: "Event fetched successfully", event },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        msg: "Failed to fetch event",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}