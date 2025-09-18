import { type NextRequest, NextResponse } from "next/server"
import { updateAdminCredentials, getAdminCredentials } from "@/lib/auth"
import { cookies } from "next/headers"

async function checkAdminAuth() {
  const cookieStore = await cookies()
  return cookieStore.get("admin-session")?.value === "authenticated"
}

export async function PUT(request: NextRequest) {
  try {
    const isAuthenticated = await checkAdminAuth()
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currentUsername, newUsername, newPassword, recoveryEmail } = await request.json()

    const success = await updateAdminCredentials(currentUsername, newUsername, newPassword, recoveryEmail)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Update failed" }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await checkAdminAuth()
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const username = url.searchParams.get("username")

    if (!username) {
      return NextResponse.json({ error: "Username required" }, { status: 400 })
    }

    const credentials = await getAdminCredentials(username)

    if (credentials) {
      // Don't send password hash to client
      const { password_hash, ...safeCredentials } = credentials
      return NextResponse.json(safeCredentials)
    } else {
      return NextResponse.json({ error: "Credentials not found" }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch credentials" }, { status: 500 })
  }
}
