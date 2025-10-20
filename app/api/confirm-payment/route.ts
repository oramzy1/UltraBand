import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendPaymentSuccessEmails } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { booking_id, paypal_token } = await request.json();
    
    console.log("Confirming payment for booking:", booking_id);
    
    const supabase = await createClient();
    
    // Get booking details
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", booking_id)
      .single();
    
    if (fetchError || !booking) {
      console.error("Booking not found:", fetchError);
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    
    // Check if already processed
    if (booking.payment_status === "paid") {
      console.log("Payment already processed");
      return NextResponse.json({ 
        success: true, 
        message: "Payment already confirmed" 
      });
    }
    
    const amount = booking.proposed_cost || 0;
    const transactionId = paypal_token || `manual-${Date.now()}`;
    
    // Update booking status
    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        payment_status: "paid",
        status: "accepted",
        archived: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", booking_id);
    
    if (updateError) {
      console.error("Error updating booking:", updateError);
      return NextResponse.json({ 
        error: "Failed to update booking status" 
      }, { status: 500 });
    }
    
    console.log("Booking status updated to paid");
    
    // Create automatic event (not public)
    const { error: eventError } = await supabase.from("events").insert({
      title: `${booking.event_type || 'Event'} - ${booking.client_name}`,
      description: booking.event_description || `Booking for ${booking.client_name}`,
      event_date: booking.event_date,
      event_time: booking.event_time,
      venue: booking.event_location.split(',')[0]?.trim() || booking.event_location,
      venue_address: booking.event_location,
      is_public: false,
      booking_id: booking_id,
    });
    
    if (eventError) {
      console.error("Error creating event:", eventError);
      // Don't fail the request, event creation is secondary
    } else {
      console.log("Private event created");
    }
    
    // Create transaction record
    const { error: transactionError } = await supabase.from("transactions").insert({
      booking_id: booking_id,
      amount,
      payment_method: "paypal",
      transaction_id: transactionId,
      status: "completed",
      client_name: booking.client_name,
      client_email: booking.client_email,
    });
    
    if (transactionError) {
      console.error("Error creating transaction:", transactionError);
      // Don't fail the request, transaction record is secondary
    } else {
      console.log("Transaction record created");
    }
    
    // Send success emails with invoice
    try {
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
      console.log("Success emails sent to:", booking.client_email);
    } catch (emailError) {
      console.error("Error sending emails:", emailError);
      // Don't fail the request if emails fail
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Payment confirmed successfully" 
    });
    
  } catch (error) {
    console.error("Error in confirm-payment:", error);
    return NextResponse.json({ 
      error: "Failed to confirm payment",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}