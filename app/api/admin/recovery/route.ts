
import { type NextRequest, NextResponse } from "next/server"
import { sendPasswordRecovery } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    console.log('[Recovery] Recovery requested for:', email);

    const result = await sendPasswordRecovery(email);
    
    console.log('[Recovery] Recovery result:', result);

    // Always return success to prevent email enumeration
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Recovery] Error:', error);
    return NextResponse.json({ error: "Recovery failed" }, { status: 500 })
  }
}