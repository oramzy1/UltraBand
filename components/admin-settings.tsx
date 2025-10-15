"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Key, Mail, User } from "lucide-react"

interface AdminCredentials {
  id: string
  username: string
  recovery_email: string
  created_at: string
  updated_at: string
}

export function AdminSettings() {
  const [credentials, setCredentials] = useState<AdminCredentials | null>(null)
  const [currentUsername, setCurrentUsername] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [recoveryEmail, setRecoveryEmail] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchCredentials()
  }, [])

  const fetchCredentials = async () => {
    try {
      // For demo purposes, we'll use 'admin' as the default username
      const response = await fetch("/api/admin/credentials?username=admin")
      if (response.ok) {
        const data = await response.json()
        setCredentials(data)
        setCurrentUsername(data.username)
        setNewUsername(data.username)
        setRecoveryEmail(data.recovery_email)
      }
    } catch (error) {
      setError("Failed to load credentials")
    }
  }

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");
  
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
  
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await fetch("/api/admin/credentials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentUsername,
          newUsername,
          newPassword,
          recoveryEmail,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setMessage("Credentials updated successfully! Please log in again with your new credentials.");
        setCurrentUsername(newUsername);
        setNewPassword("");
        setConfirmPassword("");
        fetchCredentials();
        
        // If username changed, user should re-login
        if (currentUsername !== newUsername) {
          setTimeout(() => {
            window.location.href = "/admin/login";
          }, 2000);
        }
      } else {
        setError(result.error || "Failed to update credentials");
      }
    } catch (error) {
      setError("Update failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Admin Credentials
          </CardTitle>
          <p className="text-sm text-muted-foreground">Update your admin login credentials and recovery email</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateCredentials} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recovery-email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Recovery Email
                </Label>
                <Input
                  id="recovery-email"
                  type="email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Credentials"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {credentials && (
        <Card>
          <CardHeader>
            <CardTitle>Current Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Username:</span>
              <span className="text-sm font-medium">{credentials.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Recovery Email:</span>
              <span className="text-sm font-medium">{credentials.recovery_email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Last Updated:</span>
              <span className="text-sm font-medium">{new Date(credentials.updated_at).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
