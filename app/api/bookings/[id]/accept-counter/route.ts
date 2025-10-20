import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generatePayPalLink } from "@/lib/paypal";
import { sendPaymentLinkEmail } from "@/lib/email";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params; // Await params
    const supabase = await createClient();

    // Fetch booking
    const { data: booking } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", params.id)
      .single();

    const finalAmount = booking.client_counter_offer;

    // Generate PayPal payment link
    const paymentLink = await generatePayPalLink({
      amount: finalAmount,
      description: `Event Booking - ${booking.client_name}`,
      bookingId: params.id,
    });

    // Update negotiation history
    const negotiationEntry = {
      timestamp: new Date().toISOString(),
      actor: 'admin',
      action: 'accept',
      amount: finalAmount,
    };

    const updatedHistory = [
      ...(booking.negotiation_history || []),
      negotiationEntry,
    ];

    // Update booking
    const { data: updatedBooking } = await supabase
      .from("bookings")
      .update({
        proposed_cost: finalAmount,
        payment_link: paymentLink,
        status: 'accepted', // Use existing status
        negotiation_history: updatedHistory,
      })
      .eq("id", params.id)
      .select()
      .single();

    // Send payment link email
    await sendPaymentLinkEmail({
      clientName: booking.client_name,
      clientEmail: booking.client_email,
      amount: finalAmount,
      paymentLink,
      eventDate: booking.event_date,
    });

    return NextResponse.json({ booking: updatedBooking });
  } catch (error) {
    console.error("Error accepting counter offer:", error);
    return NextResponse.json(
      { error: "Failed to accept counter offer" },
      { status: 500 }
    );
  }
}