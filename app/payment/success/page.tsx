"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");

  useEffect(() => {
    // TODO: Update booking status to 'paid'
    console.log("Payment successful for booking:", bookingId);
  }, [bookingId]);

  return (
    <div className="container max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
      <p>Your booking has been confirmed. Check your email for details.</p>
    </div>
  );
}