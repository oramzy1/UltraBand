import { type NextRequest, NextResponse } from "next/server"
import { sendPasswordRecovery } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    const emailExists = await sendPasswordRecovery(email)

    // Always return success to prevent email enumeration
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Recovery failed" }, { status: 500 })
  }
}
