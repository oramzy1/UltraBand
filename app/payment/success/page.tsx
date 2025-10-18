"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("booking_id");
  const token = searchParams.get("token"); // PayPal order ID
  
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [message, setMessage] = useState("Processing your payment...");

  useEffect(() => {
    const confirmPayment = async () => {
      if (!bookingId) {
        setStatus("error");
        setMessage("Booking ID not found");
        return;
      }
      
      try {
        const response = await fetch("/api/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            booking_id: bookingId,
            paypal_token: token 
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setStatus("success");
          setMessage("Payment confirmed! Check your email for booking details.");
        } else {
          setStatus("error");
          setMessage(data.error || "Payment confirmation failed");
        }
      } catch (error) {
        console.error("Error confirming payment:", error);
        setStatus("error");
        setMessage("An error occurred while confirming your payment");
      }
    };

    confirmPayment();
  }, [bookingId, token]);

  return (
    <div className="container max-w-2xl mx-auto p-6 min-h-screen flex items-center justify-center">
      <Card className="w-full">
        <CardContent className="pt-6">
          {status === "processing" && (
            <div className="text-center space-y-4">
              <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary" />
              <h1 className="text-2xl font-bold">Processing Payment</h1>
              <p className="text-muted-foreground">{message}</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 mx-auto text-green-600" />
              <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
              <p className="text-lg">{message}</p>
              <div className="border border-gray-800 rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-300">
                  <strong>What's next?</strong>
                  <br />
                  • You'll receive a confirmation email with your invoice
                  <br />
                  • Our team will contact you with event details
                  <br />
                  • Your booking is now confirmed!
                </p>
              </div>
              <Button onClick={() => router.push("/")} className="mt-4">
                Return to Home
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="text-center space-y-4">
              <XCircle className="h-16 w-16 mx-auto text-red-600" />
              <h1 className="text-2xl font-bold text-red-600">Payment Issue</h1>
              <p className="text-muted-foreground">{message}</p>
              <Button 
                variant="outline" 
                onClick={() => router.push("/contact")}
                className="mt-4"
              >
                Contact Support
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}