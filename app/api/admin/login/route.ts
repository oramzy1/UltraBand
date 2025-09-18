import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminCredentials } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    console.log("[v0] Login attempt for username:", username)

    const isValid = await verifyAdminCredentials(username, password)

    console.log("[v0] Login validation result:", isValid)

    if (isValid) {
      // Set secure session cookie
      const cookieStore = await cookies()
      cookieStore.set("admin-session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      console.log("[v0] Session cookie set successfully")
      return NextResponse.json({ success: true })
    } else {
      console.log("[v0] Invalid credentials provided")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    console.log("[v0] Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
