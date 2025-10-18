import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendPaymentSuccessEmails } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // PayPal sends the order ID in the resource field
    const orderId = body.resource?.id;
    const status = body.event_type;
    
    if (status === "PAYMENT.CAPTURE.COMPLETED") {
      const customId = body.resource?.purchase_units?.[0]?.custom_id; // This is our booking ID
      const amount = parseFloat(body.resource?.amount?.value || "0");
      
      const supabase = createClient();
      
      // Get booking details
      const { data: booking } = await (await supabase)
        .from("bookings")
        .select("*")
        .eq("id", customId)
        .single();
      
      if (!booking) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      }
      
      // Update booking status
      await (await supabase)
        .from("bookings")
        .update({
          payment_status: "paid",
          status: "accepted",
        })
        .eq("id", customId);
      
      // Create automatic event (not public)
      await (await supabase).from("events").insert({
        title: `${booking.event_type || 'Event'} - ${booking.client_name}`,
        description: booking.event_description || `Booking for ${booking.client_name}`,
        event_date: booking.event_date,
        event_time: booking.event_time,
        venue: booking.event_location.split(',')[0] || booking.event_location,
        venue_address: booking.event_location,
        is_public: false, // Private by default
        booking_id: customId,
      });
      
      // Create transaction record
      await (await supabase).from("transactions").insert({
        booking_id: customId,
        amount,
        payment_method: "paypal",
        transaction_id: orderId,
        status: "completed",
        client_name: booking.client_name,
        client_email: booking.client_email,
      });
      
      // Send success emails with invoice
      await sendPaymentSuccessEmails({
        clientName: booking.client_name,
        clientEmail: booking.client_email,
        amount,
        transactionId: orderId,
        bookingDetails: {
          eventType: booking.event_type,
          eventDate: booking.event_date,
          eventTime: booking.event_time,
          eventLocation: booking.event_location,
          serviceCategory: booking.service_category,
        },
      });
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}