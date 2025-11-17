import { NextRequest, NextResponse } from "next/server";
import { createBooking, getUserBookings } from "@/lib/services/bookings";
import { sendNewBookingNotification } from "@/lib/services/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (
      !body.name ||
      !body.email ||
      !body.phone ||
      !body.vehicleType ||
      !body.pickupDate ||
      !body.returnDate
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate booking details
    const pickupDate = new Date(body.pickupDate);
    const returnDate = new Date(body.returnDate);
    const totalDays = Math.ceil(
      (returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (totalDays <= 0) {
      return NextResponse.json(
        { error: "Return date must be after pickup date" },
        { status: 400 }
      );
    }

    // Create booking in Firestore
    const bookingId = await createBooking({
      name: body.name,
      email: body.email,
      phone: body.phone,
      vehicleType: body.vehicleType,
      pickupDate: body.pickupDate,
      returnDate: body.returnDate,
      message: body.message || "",
      status: "pending",
      paymentStatus: "pending",
    });

    // Send notification emails
    try {
      await sendNewBookingNotification({
        bookingId,
        customerName: body.name,
        customerEmail: body.email,
        customerPhone: body.phone,
        vehicleName: body.vehicleType,
        pickupDate: body.pickupDate,
        returnDate: body.returnDate,
        totalPrice: body.totalPrice || "TBD",
        advancePayment: body.advancePayment || 0,
        contactEmail: process.env.NEXT_PUBLIC_APP_EMAIL,
        status: "pending",
      });
    } catch (emailError) {
      console.error("Error sending notification emails:", emailError);
      // Don't fail the booking if email fails
    }

    return NextResponse.json(
      {
        message: "Booking created successfully",
        bookingId,
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    const bookings = await getUserBookings(email);

    return NextResponse.json({
      success: true,
      bookings,
      total: bookings.length,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
