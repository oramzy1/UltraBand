import { createClient } from "@/lib/supabase/server"

export interface AdminCredentials {
  id: string
  username: string
  password_hash: string
  recovery_email: string
  created_at: string
  updated_at: string
}

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  console.log("[v0] Verifying credentials for username:", username)

  const supabase = await createClient()

  const { data: admin, error } = await supabase
    .from("admin_credentials")
    .select("password_hash")
    .eq("username", username)
    .single()

  console.log("[v0] Database query result:", { admin, error })

  if (!admin) {
    console.log("[v0] No admin found with username:", username)
    return false
  }

  const isValid = password === admin.password_hash
  console.log("[v0] Password validation result:", isValid)

  return isValid
}

export async function updateAdminCredentials(
  currentUsername: string,
  newUsername: string,
  newPassword: string,
  recoveryEmail: string,
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("admin_credentials")
    .update({
      username: newUsername,
      password_hash: newPassword,
      recovery_email: recoveryEmail,
      updated_at: new Date().toISOString(),
    })
    .eq("username", currentUsername)

  return !error
}

export async function getAdminCredentials(username: string): Promise<AdminCredentials | null> {
  const supabase = await createClient()

  const { data: admin } = await supabase.from("admin_credentials").select("*").eq("username", username).single()

  return admin
}

export async function sendPasswordRecovery(email: string): Promise<boolean> {
  const supabase = await createClient()

  const { data: admin } = await supabase
    .from("admin_credentials")
    .select("username")
    .eq("recovery_email", email)
    .single()

  if (!admin) return false

  // In a real app, you'd send an email here
  // For now, we'll just return true to indicate the email exists
  console.log(`Password recovery requested for admin: ${admin.username}`)
  return true
}
