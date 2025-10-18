import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendPaymentSuccessEmails } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("PayPal Webhook received:", JSON.stringify(body, null, 2));
    
    // Handle webhook verification
    if (body.event_type === "WEBHOOK.VERIFIED") {
      return NextResponse.json({ status: "verified" });
    }
    
    // Handle payment capture
    if (body.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const customId = body.resource?.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id;
      const amount = parseFloat(body.resource?.purchase_units?.[0]?.amount?.value || "0");
      const captureId = body.resource?.id;
      
      console.log("Processing payment:", { customId, amount, captureId });
      
      if (!customId) {
        console.error("No booking ID found in webhook");
        return NextResponse.json({ error: "No booking ID" }, { status: 400 });
      }
      
      const supabase = createClient();
      
      // Get booking details
      const { data: booking, error: bookingError } = await (await supabase)
        .from("bookings")
        .select("*")
        .eq("id", customId)
        .single();
      
      if (bookingError || !booking) {
        console.error("Booking not found:", bookingError);
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      }
      
      console.log("Booking found:", booking.client_name);
      
      // Update booking status
      const { error: updateError } = await (await supabase)
        .from("bookings")
        .update({
          payment_status: "paid",
          status: "accepted",
        })
        .eq("id", customId);
      
      if (updateError) {
        console.error("Error updating booking:", updateError);
      }
      
      // Create automatic event (not public)
      const { error: eventError } = await (await supabase).from("events").insert({
        title: `${booking.event_type || 'Event'} - ${booking.client_name}`,
        description: booking.event_description || `Booking for ${booking.client_name}`,
        event_date: booking.event_date,
        event_time: booking.event_time,
        venue: booking.event_location.split(',')[0] || booking.event_location,
        venue_address: booking.event_location,
        is_public: false,
        booking_id: customId,
      });
      
      if (eventError) {
        console.error("Error creating event:", eventError);
      }
      
      // Create transaction record
      const { error: transactionError } = await (await supabase).from("transactions").insert({
        booking_id: customId,
        amount,
        payment_method: "paypal",
        transaction_id: captureId,
        status: "completed",
        client_name: booking.client_name,
        client_email: booking.client_email,
      });
      
      if (transactionError) {
        console.error("Error creating transaction:", transactionError);
      }
      
      // Send success emails with invoice
      try {
        await sendPaymentSuccessEmails({
          clientName: booking.client_name,
          clientEmail: booking.client_email,
          amount,
          transactionId: captureId,
          bookingDetails: {
            eventType: booking.event_type,
            eventDate: booking.event_date,
            eventTime: booking.event_time,
            eventLocation: booking.event_location,
            serviceCategory: booking.service_category,
          },
        });
        console.log("Success emails sent");
      } catch (emailError) {
        console.error("Error sending emails:", emailError);
      }
      
      return NextResponse.json({ success: true, message: "Payment processed" });
    }
    
    // For other event types, just acknowledge
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json({ 
      error: "Webhook processing failed", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}

// Allow GET for webhook verification
export async function GET() {
  return NextResponse.json({ status: "Webhook endpoint active" });
}