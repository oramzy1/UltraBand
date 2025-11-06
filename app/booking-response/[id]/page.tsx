// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useSearchParams, useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Loader2, CheckCircle, XCircle, Building2, CreditCard, ExternalLink } from "lucide-react";
// import { BANK_DETAILS } from "@/lib/bank-details";

// export default function BookingResponsePage() {
//   const params = useParams();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const action = searchParams.get('action');
//   const [booking, setBooking] = useState<any>(null);
//   const [counterOffer, setCounterOffer] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [paymentLink, setPaymentLink] = useState("");
//   const [showBankDetails, setShowBankDetails] = useState(false);

//   useEffect(() => {
//     const fetchBooking = async () => {
//       try {
//         const res = await fetch(`/api/bookings/${params.id}`);
//         if (!res.ok) throw new Error('Failed to fetch booking');
//         const data = await res.json();
//         console.log("Booking data:", data); // Debug log
//         setBooking(data);
//       } catch (err) {
//         console.error("Error fetching booking:", err);
//         setError("Failed to load booking details");
//       } finally {
//         setFetchLoading(false);
//       }
//     };

//     fetchBooking();
//   }, [params.id]);

//   const handleResponse = async (responseAction: string) => {
//     setLoading(true);
//     setError("");
//     setSuccess("");
    
//     try {
//       const res = await fetch(`/api/bookings/${params.id}/client-response`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           action: responseAction,
//           counter_offer: responseAction === 'counter' ? parseFloat(counterOffer) : undefined,
//         }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || 'Failed to process response');
//       }

//       const result = await res.json();
      
//       if (responseAction === 'accept')  {
//         // Store payment link from response
//         if (result.paymentLink) {
//           setPaymentLink(result.paymentLink);
//           setSuccess("Proposal accepted! Click below to proceed to payment.");
//         } else {
//           setError("Failed to generate payment link");
//         }
//       } else if (responseAction === 'counter') {
//         setSuccess("Counter offer submitted successfully!");
//       } else if (responseAction === 'cancel') {
//         setSuccess("Booking cancelled.");
//       }
      
//       // Refresh booking data
//       const updatedRes = await fetch(`/api/bookings/${params.id}`);
//       const updatedData = await updatedRes.json();
//       setBooking(updatedData);
      
//     } catch (err: any) {
//       console.error("Error handling response:", err);
//       setError(err.message || "Failed to process your response. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (fetchLoading) {
//     return (
//       <div className="container max-w-2xl mx-auto p-6 flex justify-center items-center min-h-screen">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     );
//   }

//   if (error && !booking) {
//     return (
//       <div className="container max-w-2xl mx-auto p-6">
//         <Alert variant="destructive">
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       </div>
//     );
//   }

//   if (!booking) {
//     return <div className="container max-w-2xl mx-auto p-6">Booking not found</div>;
//   }

//   return (
//     <div className="container max-w-2xl mx-auto p-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Booking Response</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           {error && (
//             <Alert variant="destructive">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}
          
//           {success && (
//             <Alert>
//               <AlertDescription>{success}</AlertDescription>
//             </Alert>
//           )}

//           <div className="space-y-2">
//             <p className="text-lg">
//               Proposed Cost: <strong>${booking.proposed_cost ? booking.proposed_cost.toFixed(2) : 'Not set'}</strong>
//             </p>
//             <p className="text-sm text-muted-foreground">
//               Event: {booking.event_type || 'N/A'} | {new Date(booking.event_date).toLocaleDateString()}
//             </p>
//           </div>

//           {action === 'accept' && (
//             <div className="space-y-4">
//               <p>You're about to accept this proposal.</p>
//               <Button 
//                 onClick={() => handleResponse('accept')} 
//                 disabled={loading}
//                 className="w-full"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Generating Payment Link...
//                   </>
//                 ) : (
//                   "Confirm & Proceed to Payment"
//                 )}
//               </Button>
//             </div>
//           )}

//           {/* Show payment link after accepting */}
//           {paymentLink && (
//             <div className="space-y-4 border-t pt-4">
//               <div className="border-gray-800 border rounded-lg p-4">
//                 <h3 className="font-semibold text-green-800 mb-2">Ready to Complete Payment!</h3>
//                 <p className="text-sm text-gray-300 mb-4">
//                   Click the button below to proceed to PayPal and complete your payment.
//                 </p>
//                 <a 
//                   href={paymentLink}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
//                 >
//                   Proceed to PayPal Payment
//                   <ExternalLink className="ml-2 h-5 w-5" />
//                 </a>
//               </div>
//               <p className="text-xs text-muted-foreground text-center">
//                 You'll be redirected to PayPal to complete your payment securely
//               </p>
//             </div>
//           )}

//           {action === 'counter' && (
//             <div className="space-y-4">
//               <p>Make a counter offer:</p>
//               <Input
//                 type="number"
//                 step="0.01"
//                 placeholder="Your counter offer (e.g., 1200.00)"
//                 value={counterOffer}
//                 onChange={(e) => setCounterOffer(e.target.value)}
//               />
//               <Button 
//                 onClick={() => handleResponse('counter')} 
//                 disabled={loading || !counterOffer}
//                 className="w-full"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Submitting...
//                   </>
//                 ) : (
//                   "Send Counter Offer"
//                 )}
//               </Button>
//             </div>
//           )}

//           {action === 'cancel' && (
//             <div className="space-y-4">
//               <p className="text-destructive font-medium">Are you sure you want to cancel this booking?</p>
//               <Button 
//                 variant="destructive" 
//                 onClick={() => handleResponse('cancel')} 
//                 disabled={loading}
//                 className="w-full"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Cancelling...
//                   </>
//                 ) : (
//                   "Confirm Cancellation"
//                 )}
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2, XCircle, Building2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BANK_DETAILS } from "@/lib/bank-details";

export default function BookingResponsePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("booking_id");
  const action = searchParams.get("action");
  
  const [booking, setBooking] = useState<any>(null);
  const [counterOffer, setCounterOffer] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showBankDetails, setShowBankDetails] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        if (!res.ok) throw new Error('Failed to fetch booking');
        const data = await res.json();
        setBooking(data);
        
        // Show bank details if status is awaiting_payment
        if (data.status === 'awaiting_payment') {
          setShowBankDetails(true);
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError("Failed to load booking details");
      } finally {
        setFetchLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const handleResponse = async (responseAction: string) => {
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const res = await fetch(`/api/bookings/${bookingId}/client-response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: responseAction,
          counter_offer: responseAction === 'counter' ? parseFloat(counterOffer) : undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to process response');
      }

      const result = await res.json();
      
      if (responseAction === 'accept') {
        setShowBankDetails(true);
        setSuccess("Proposal accepted! Please make payment using the bank details below.");
      } else if (responseAction === 'counter') {
        setSuccess("Counter offer submitted successfully!");
      } else if (responseAction === 'cancel') {
        setSuccess("Booking cancelled.");
      }
      
      const updatedRes = await fetch(`/api/bookings/${bookingId}`);
      const updatedData = await updatedRes.json();
      setBooking(updatedData);
      
    } catch (err: any) {
      console.error("Error handling response:", err);
      setError(err.message || "Failed to process your response.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/confirm-payment-client`, {
        method: 'POST',
      });

      if (!res.ok) throw new Error('Failed to confirm payment');

      setSuccess("Payment confirmation sent! Our team will verify and confirm your booking shortly.");
    } catch (err) {
      setError("Failed to send payment confirmation");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="container max-w-2xl mx-auto p-6 flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <Card>
        <CardContent className="pt-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <CheckCircle className="h-5 w-5 text-green-600 inline mr-2" />
              <span className="text-green-800">{success}</span>
            </div>
          )}

          {booking && (
            <div className="space-y-2">
              <p className="text-lg">
                Proposed Cost: <strong>${booking.proposed_cost ? booking.proposed_cost.toFixed(2) : 'Not set'}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Event: {booking.event_type || 'N/A'} | {new Date(booking.event_date).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Accept Action */}
          {action === 'accept' && !showBankDetails && (
            <div className="space-y-4">
              <p>You're about to accept this proposal.</p>
              <Button 
                onClick={() => handleResponse('accept')} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm & View Payment Details"
                )}
              </Button>
            </div>
          )}

          {/* Bank Details Display */}
          {showBankDetails && (
            <div className="space-y-6">
              <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-6 w-6 text-amber-600" />
                  <h3 className="text-lg font-semibold text-amber-900">Bank Transfer Details</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Amount to Pay:</span>
                    <strong className="text-xl text-amber-900">${booking?.proposed_cost?.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Bank Name:</span>
                    <strong>{BANK_DETAILS.bankName}</strong>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Account Name:</span>
                    <strong>{BANK_DETAILS.accountName}</strong>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Account Number:</span>
                    <strong className="font-mono">{BANK_DETAILS.accountNumber}</strong>
                  </div>
                  {BANK_DETAILS.routingNumber && (
                    <div className="flex justify-between py-2">
                      <span>Routing Number:</span>
                      <strong className="font-mono">{BANK_DETAILS.routingNumber}</strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-medium mb-2">📌 Important Instructions:</p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Include your full name in the transfer reference</li>
                  <li>Keep your payment receipt/confirmation</li>
                  <li>Click "I Have Made Payment" after transferring</li>
                </ul>
              </div>

              {!booking?.payment_confirmed_by_client ? (
                <Button 
                  onClick={handleConfirmPayment}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending Confirmation...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      I Have Made Payment
                    </>
                  )}
                </Button>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-green-900">Payment Confirmation Sent!</p>
                  <p className="text-sm text-green-700 mt-1">
                    Our team will verify your payment and confirm your booking shortly.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Counter Offer */}
          {action === 'counter' && (
            <div className="space-y-4">
              <p>Make a counter offer:</p>
              <input
                type="number"
                step="0.01"
                placeholder="Your counter offer (e.g., 1200.00)"
                value={counterOffer}
                onChange={(e) => setCounterOffer(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <Button 
                onClick={() => handleResponse('counter')} 
                disabled={loading || !counterOffer}
                className="w-full"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Send Counter Offer
              </Button>
            </div>
          )}

          {/* Cancel */}
          {action === 'cancel' && (
            <div className="space-y-4">
              <p className="text-destructive font-medium">Cancel this booking?</p>
              <Button 
                variant="destructive" 
                onClick={() => handleResponse('cancel')} 
                disabled={loading}
                className="w-full"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Confirm Cancellation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}