// import { createClient } from "@/lib/supabase/server"

// export interface AdminCredentials {
//   id: string
//   username: string
//   password_hash: string
//   recovery_email: string
//   created_at: string
//   updated_at: string
// }

// export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
//   console.log("[v0] Verifying credentials for username:", username)

//   const supabase = await createClient()

//   const { data: admin, error } = await supabase
//     .from("admin_credentials")
//     .select("password_hash")
//     .eq("username", username)
//     .single()

//   console.log("[v0] Database query result:", { admin, error })

//   if (!admin) {
//     console.log("[v0] No admin found with username:", username)
//     return false
//   }

//   const isValid = password === admin.password_hash
//   console.log("[v0] Password validation result:", isValid)

//   return isValid
// }

// export async function updateAdminCredentials(
//   currentUsername: string,
//   newUsername: string,
//   newPassword: string,
//   recoveryEmail: string,
// ): Promise<boolean> {
//   const supabase = await createClient()

//   const { error } = await supabase
//     .from("admin_credentials")
//     .update({
//       username: newUsername,
//       password_hash: newPassword,
//       recovery_email: recoveryEmail,
//       updated_at: new Date().toISOString(),
//     })
//     .eq("username", currentUsername)

//   return !error
// }

// export async function getAdminCredentials(username: string): Promise<AdminCredentials | null> {
//   const supabase = await createClient()

//   const { data: admin } = await supabase.from("admin_credentials").select("*").eq("username", username).single()

//   return admin
// }

// export async function sendPasswordRecovery(email: string): Promise<boolean> {
//   const supabase = await createClient()

//   const { data: admin } = await supabase
//     .from("admin_credentials")
//     .select("username")
//     .eq("recovery_email", email)
//     .single()

//   if (!admin) return false

//   // In a real app, you'd send an email here
//   // For now, we'll just return true to indicate the email exists
//   console.log(`Password recovery requested for admin: ${admin.username}`)
//   return true
// }


// import { createClient } from "@/lib/supabase/server"

// export interface AdminCredentials {
//   id: string
//   username: string
//   password_hash: string
//   recovery_email: string
//   created_at: string
//   updated_at: string
// }

// export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
//   console.log("[v0] Verifying credentials for username:", username)

//   if (username === "admin" && password === "admin123") {
//     console.log("[v0] Using fallback authentication - login successful")
//     return true
//   }

//   try {
//     const supabase = await createClient()

//     const { data: admin, error } = await supabase
//       .from("admin_credentials")
//       .select("password_hash")
//       .eq("username", username)
//       .single()

//     console.log("[v0] Database query result:", { admin, error })

//     if (error) {
//       console.log("[v0] Database error, using fallback:", error.message)
//       return username === "admin" && password === "admin123"
//     }

//     if (!admin) {
//       console.log("[v0] No admin found with username:", username)
//       return username === "admin" && password === "admin123"
//     }

//     const isValid = password === admin.password_hash
//     console.log("[v0] Password validation result:", isValid)

//     return isValid
//   } catch (error) {
//     console.log("[v0] Auth error, using fallback:", error)
//     return username === "admin" && password === "admin123"
//   }
// }

// export async function updateAdminCredentials(
//   currentUsername: string,
//   newUsername: string,
//   newPassword: string,
//   recoveryEmail: string,
// ): Promise<boolean> {
//   const supabase = await createClient()

//   const { error } = await supabase
//     .from("admin_credentials")
//     .update({
//       username: newUsername,
//       password_hash: newPassword,
//       recovery_email: recoveryEmail,
//       updated_at: new Date().toISOString(),
//     })
//     .eq("username", currentUsername)

//   return !error
// }

// export async function getAdminCredentials(username: string): Promise<AdminCredentials | null> {
//   const supabase = await createClient()

//   const { data: admin } = await supabase.from("admin_credentials").select("*").eq("username", username).single()

//   return admin
// }

// export async function sendPasswordRecovery(email: string): Promise<boolean> {
//   const supabase = await createClient()

//   const { data: admin } = await supabase
//     .from("admin_credentials")
//     .select("username")
//     .eq("recovery_email", email)
//     .single()

//   if (!admin) return false

//   // In a real app, you'd send an email here
//   // For now, we'll just return true to indicate the email exists
//   console.log(`Password recovery requested for admin: ${admin.username}`)
//   return true
// }






import bcrypt from 'bcryptjs';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendPasswordRecoveryEmail } from '@/lib/email';

const SALT_ROUNDS = 10;

export async function verifyAdminCredentials(username: string, password: string): Promise {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('admin_credentials')
      .select('password_hash')
      .eq('username', username)
      .single();

    if (error || !data) {
      console.log('[Auth] User not found:', username);
      return false;
    }

    const isValid = await bcrypt.compare(password, data.password_hash);
    console.log('[Auth] Password validation:', isValid);
    return isValid;
  } catch (error) {
    console.error('[Auth] Verification error:', error);
    return false;
  }
}

export async function updateAdminCredentials(
  currentUsername: string,
  newUsername: string,
  newPassword: string,
  recoveryEmail: string
): Promise {
  try {
    const supabase = createAdminClient();

    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    const { error } = await supabase
      .from('admin_credentials')
      .update({
        username: newUsername,
        password_hash: passwordHash,
        recovery_email: recoveryEmail,
        is_initial_password: false,
        updated_at: new Date().toISOString(),
      })
      .eq('username', currentUsername);

    if (error) {
      console.error('[Auth] Update error:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('[Auth] Update error:', error);
    return false;
  }
}

export async function getAdminCredentials(username: string) {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('admin_credentials')
      .select('id, username, recovery_email, created_at, updated_at, is_initial_password')
      .eq('username', username)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('[Auth] Get credentials error:', error);
    return null;
  }
}

export async function sendPasswordRecovery(email: string): Promise {
  try {
    const supabase = createAdminClient();

    // Check if email exists
    const { data, error } = await supabase
      .from('admin_credentials')
      .select('username, recovery_email')
      .eq('recovery_email', email)
      .single();

    if (error || !data) {
      console.log('[Auth] Recovery email not found, but returning success');
      // Don't reveal if email exists - return true anyway
      return true;
    }

    console.log('[Auth] Found admin account for recovery');

    // Reset to initial credentials
    const initialPasswordHash = await bcrypt.hash('admin123', SALT_ROUNDS);

    const { error: updateError } = await supabase
      .from('admin_credentials')
      .update({
        username: 'admin',
        password_hash: initialPasswordHash,
        is_initial_password: true,
        updated_at: new Date().toISOString(),
      })
      .eq('recovery_email', email);

    if (updateError) {
      console.error('[Auth] Failed to reset credentials:', updateError);
      throw updateError;
    }

    console.log('[Auth] Credentials reset, sending email');

    // Send recovery email
    await sendPasswordRecoveryEmail({
      email: email,
      username: 'admin',
      temporaryPassword: 'admin123',
    });

    console.log('[Auth] Recovery email sent successfully');

    return true;
  } catch (error) {
    console.error('[Auth] Recovery error:', error);
    return false;
  }
}