import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { sendBookingStatusUpdateEmails } from "@/lib/email"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase.from("bookings").select("*").eq("id", id).single()

    if (error) throw error

    return NextResponse.json({ booking: data })
  } catch (error) {
    console.error("Error fetching booking:", error)
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    // First, get the current booking to access client email and other details
    const { data: currentBooking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError) throw fetchError

    // Update the booking
    const { data, error } = await supabase
      .from("bookings")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    // Send email notification if status changed
    if (body.status && body.status !== currentBooking.status) {
      try {
        await sendBookingStatusUpdateEmails({
          clientName: data.client_name,
          clientEmail: data.client_email,
          status: data.status,
          eventDate: data.event_date,
          eventTime: data.event_time,
          eventLocation: data.event_location,
          serviceCategory: data.service_category,
          eventType: data.event_type || '',
          notes: data.notes || '',
          proposedDate: data.proposed_date || '',
          proposedTime: data.proposed_time || '',
        })
      } catch (emailError) {
        // Log email error but don't fail the request since booking was updated
        console.error("Error sending status update emails:", emailError)
      }
    }

    return NextResponse.json({ booking: data })
  } catch (error) {
    console.error("Error updating booking:", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase.from("bookings").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ message: "Booking deleted successfully" })
  } catch (error) {
    console.error("Error deleting booking:", error)
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 })
  }
}
