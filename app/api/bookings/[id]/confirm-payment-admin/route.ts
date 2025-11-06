import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendPaymentSuccessEmails } from "@/lib/email";

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

    const amount = booking.proposed_cost || 0;
    const transactionId = `bank-${Date.now()}`;

    // Update booking
    await supabase
      .from("bookings")
      .update({
        payment_confirmed_by_admin: true,
        payment_status: "paid",
        status: "payment_confirmed",
        archived: true,
      })
      .eq("id", params.id);

    // Create event
    await supabase.from("events").insert({
      title: `${booking.event_type || 'Event'} - ${booking.client_name}`,
      description: booking.event_description || `Booking for ${booking.client_name}`,
      event_date: booking.event_date,
      event_time: booking.event_time,
      venue: booking.event_location.split(',')[0]?.trim() || booking.event_location,
      venue_address: booking.event_location,
      is_public: false,
      booking_id: params.id,
    });

    // Create transaction
    await supabase.from("transactions").insert({
      booking_id: params.id,
      amount,
      payment_method: "bank_transfer",
      transaction_id: transactionId,
      status: "completed",
      client_name: booking.client_name,
      client_email: booking.client_email,
    });

    // Send success emails
    await sendPaymentSuccessEmails({
      clientName: booking.client_name,
      clientEmail: booking.client_email,
      amount,
      transactionId,
      bookingDetails: {
        eventType: booking.event_type,
        eventDate: booking.event_date,
        eventTime: booking.event_time,
        eventLocation: booking.event_location,
        serviceCategory: booking.service_category,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 });
  }
}