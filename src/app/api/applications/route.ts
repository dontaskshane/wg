import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// POST create application
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { message, listingId } = await req.json();

    if (!message || !listingId) {
      return NextResponse.json(
        { error: "Nachricht und Inserat-ID sind erforderlich" },
        { status: 400 }
      );
    }

    // Check if listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Inserat nicht gefunden" },
        { status: 404 }
      );
    }

    // Check if user already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        applicantId: session.user.id,
        listingId,
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "Du hast dich bereits beworben" },
        { status: 400 }
      );
    }

    // Can't apply to own listing
    if (listing.landlordId === session.user.id) {
      return NextResponse.json(
        { error: "Du kannst dich nicht auf dein eigenes Inserat bewerben" },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: {
        message,
        applicantId: session.user.id,
        listingId,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Fehler beim Bewerben" },
      { status: 500 }
    );
  }
}
