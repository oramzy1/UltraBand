import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendPaymentConfirmationToAdmin } from "@/lib/email";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const supabase = await createClient();

    const { data: booking } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", params.id)
      .single();

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Update booking status
    await supabase
      .from("bookings")
      .update({
        payment_confirmed_by_client: true,
        status: 'payment_processing',
      })
      .eq("id", params.id);

    // Send notification to admin
    await sendPaymentConfirmationToAdmin({
      clientName: booking.client_name,
      clientEmail: booking.client_email,
      amount: booking.proposed_cost,
      bookingId: params.id,
      eventDate: booking.event_date,
      eventTime: booking.event_time,
      eventLocation: booking.event_location,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 });
  }
}