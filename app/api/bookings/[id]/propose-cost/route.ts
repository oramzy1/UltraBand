import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendCostProposalEmail } from "@/lib/email";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params; // Await params
    const supabase = createClient();
    const { proposed_cost, notes } = await request.json();

    // Fetch booking
    const { data: booking, error: fetchError } = await (await supabase)
      .from("bookings")
      .select("*")
      .eq("id", params.id)
      .single();

    if (fetchError) throw fetchError;

    // Update negotiation history
    const negotiationEntry = {
      timestamp: new Date().toISOString(),
      actor: 'admin',
      action: 'propose_cost',
      amount: proposed_cost,
      notes: notes || null,
    };

    const updatedHistory = [
      ...(booking.negotiation_history || []),
      negotiationEntry,
    ];

    // Update booking - use 'counter_proposed' status since it exists
    const { data: updatedBooking, error: updateError } = await (await supabase)
      .from("bookings")
      .update({
        proposed_cost,
        status: 'counter_proposed', // Use existing status
        notes: notes, // Add notes to the booking
        negotiation_history: updatedHistory,
      })
      .eq("id", params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Send email to client
    try {
        await sendCostProposalEmail({
          clientName: booking.client_name,
          clientEmail: booking.client_email,
          proposedCost: proposed_cost,
          notes,
          eventDate: booking.event_date,
          eventTime: booking.event_time,
          eventLocation: booking.event_location,
          bookingId: params.id,
        });
        console.log("✅ Cost proposal email sent successfully to:", booking.client_email);
      } catch (emailError) {
        console.error("❌ Failed to send cost proposal email:", emailError);
      }

    return NextResponse.json({ booking: updatedBooking });
  } catch (error) {
    console.error("Error proposing cost:", error);
    return NextResponse.json(
      { error: "Failed to propose cost" },
      { status: 500 }
    );
  }
}



export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) {
    try {
      const params = await context.params;
      const supabase = createClient();
  
      const { data: booking, error } = await (await supabase)
        .from("bookings")
        .select("*")
        .eq("id", params.id)
        .single();
  
      if (error) {
        console.error("Error fetching booking:", error);
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(booking);
    } catch (error) {
      console.error("Error in booking GET:", error);
      return NextResponse.json(
        { error: "Failed to fetch booking" },
        { status: 500 }
      );
    }
  }
  