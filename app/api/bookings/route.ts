import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { sendBookingEmails } from "@/lib/email"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let query = supabase.from("bookings").select("*").order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ bookings: data })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Convert camelCase from frontend to snake_case for database
    const dbData = {
      service_category: body.serviceCategory,
      client_name: body.clientName,
      client_email: body.clientEmail,
      client_phone: body.clientPhone,
      event_type: body.eventType,
      event_date: body.eventDate,
      event_time: body.eventTime,
      event_location: body.eventLocation,
      event_description: body.eventDescription,
      budget_range: body.budgetRange,
      status: "pending",
    }

    // Insert into database
    const { data, error } = await supabase.from("bookings").insert(dbData).select().single()

    if (error) throw error

    // Send emails after successful database insert
    try {
      await sendBookingEmails({
        serviceCategory: body.serviceCategory,
        clientName: body.clientName,
        clientEmail: body.clientEmail,
        clientPhone: body.clientPhone || '',
        eventType: body.eventType || '',
        eventDate: body.eventDate,
        eventTime: body.eventTime,
        eventLocation: body.eventLocation,
        eventDescription: body.eventDescription || '',
        budgetRange: body.budgetRange || '',
      })
    } catch (emailError) {
      // Log email error but don't fail the request since booking was saved
      console.error("Error sending booking emails:", emailError)
      // You might want to add this booking to a retry queue
    }

    return NextResponse.json({ booking: data }, { status: 201 })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}