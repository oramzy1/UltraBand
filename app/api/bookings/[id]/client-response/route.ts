import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generatePayPalLink } from "@/lib/paypal";
import { sendPaymentLinkEmail, sendBankDetailsEmail, sendCounterOfferNotification } from "@/lib/email";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params; // Await params
    const supabase = await createClient();
    const { action, counter_offer } = await request.json();
    // action: 'accept' | 'counter' | 'cancel'

    const { data: booking } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", params.id)
      .single();

    let updatedData: any = {};
    let negotiationEntry: any = {
      timestamp: new Date().toISOString(),
      actor: 'client',
    };

    let paymentLink: string | null = null;

    if (action === 'accept') {
      // Generate PayPal link
      // paymentLink = await generatePayPalLink({
      //   amount: booking.proposed_cost,
      //   description: `Event Booking - ${booking.client_name}`,
      //   bookingId: params.id,
      // });
      

      // negotiationEntry.action = 'accept';
      // updatedData = {
      //   status: 'accepted', // Use existing status
      //   payment_link: paymentLink,
      // };

      negotiationEntry.action = 'accept';
      updatedData = {
        status: 'awaiting_payment',
        payment_method: 'bank_transfer',
      };
    
      console.log("Client accepted proposal - awaiting payment");
      
      const updatedHistory = [
        ...(booking.negotiation_history || []),
        negotiationEntry,
      ];

      const { data: updatedBooking } = await supabase
      .from("bookings")
      .update({
        ...updatedData,
        negotiation_history: updatedHistory,
      })
      .eq("id", params.id)
      .select()
      .single();
  
    // Send bank details email to client
    // try {
    //   await sendBankDetailsEmail({
    //     clientName: booking.client_name,
    //     clientEmail: booking.client_email,
    //     amount: booking.proposed_cost,
    //     bookingId: params.id,
    //     eventDate: booking.event_date,
    //     eventTime: booking.event_time,
    //     eventLocation: booking.event_location,
    //   });
    //   console.log("Bank details email sent");
    // } catch (emailError) {
    //   console.error("Error sending bank details email:", emailError);
    // }
  
    return NextResponse.json({ 
      booking: updatedBooking,
      bankDetails: true // Flag to show bank details on frontend
    });
    

      // await sendPaymentLinkEmail({
      //   clientName: booking.client_name,
      //   clientEmail: booking.client_email,
      //   amount: booking.proposed_cost,
      //   paymentLink,
      //   eventDate: booking.event_date,
      // });

      // console.log("Payment link generated:", paymentLink);

    } else if (action === 'counter') {
      negotiationEntry.action = 'counter_offer';
      negotiationEntry.amount = counter_offer;
      
      updatedData = {
        client_counter_offer: counter_offer,
        status: 'counter_proposed',
      };

      // Notify admin
      await sendCounterOfferNotification({
        clientName: booking.client_name,
        counterOffer: counter_offer,
        bookingId: params.id,
      });

    } else if (action === 'cancel') {
      negotiationEntry.action = 'cancel';
      updatedData = {
        status: 'rejected',
      };
    }

    const updatedHistory = [
      ...(booking.negotiation_history || []),
      negotiationEntry,
    ];

    const { data: updatedBooking } = await supabase
      .from("bookings")
      .update({
        ...updatedData,
        negotiation_history: updatedHistory,
      })
      .eq("id", params.id)
      .select()
      .single();

    return NextResponse.json({ booking: updatedBooking, paymentLink });
  } catch (error) {
    console.error("Error processing client response:", error);
    return NextResponse.json(
      { error: "Failed to process client response" },
      { status: 500 }
    );
  }
}