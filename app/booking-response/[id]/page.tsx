// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams, useParams } from "next/navigation";
// import { Card, CardContent } from "@/components/ui/card";
// import { CheckCircle, Loader2, XCircle, Building2, CreditCard } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { BANK_DETAILS } from "@/lib/bank-details";

// export default function BookingResponsePage() {
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const bookingId = params.id as string; // Get from route params, not query params
//   const action = searchParams.get("action"); // This comes from query string

//   const [booking, setBooking] = useState<any>(null);
//   const [counterOffer, setCounterOffer] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [showBankDetails, setShowBankDetails] = useState(false);

//   useEffect(() => {
//     const fetchBooking = async () => {
//       if (!bookingId) {
//         setError("Booking ID not found");
//         setFetchLoading(false);
//         return;
//       }

//       try {
//         const res = await fetch(`/api/bookings/${bookingId}`);
//         if (!res.ok) throw new Error('Failed to fetch booking');
//         const data = await res.json();
//         setBooking(data);

//         // Show bank details if status is awaiting_payment
//         if (data.status === 'awaiting_payment') {
//           setShowBankDetails(true);
//         }
//       } catch (err) {
//         console.error("Error fetching booking:", err);
//         setError("Failed to load booking details");
//       } finally {
//         setFetchLoading(false);
//       }
//     };

//     fetchBooking();
//   }, [bookingId]);

//   const handleResponse = async (responseAction: string) => {
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const res = await fetch(`/api/bookings/${bookingId}/client-response`, {
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

//       if (responseAction === 'accept') {
//         setShowBankDetails(true);
//         setSuccess("Proposal accepted! Please make payment using the bank details below.");
//       } else if (responseAction === 'counter') {
//         setSuccess("Counter offer submitted successfully!");
//       } else if (responseAction === 'cancel') {
//         setSuccess("Booking cancelled.");
//       }

//       const updatedRes = await fetch(`/api/bookings/${bookingId}`);
//       const updatedData = await updatedRes.json();
//       setBooking(updatedData);

//     } catch (err: any) {
//       console.error("Error handling response:", err);
//       setError(err.message || "Failed to process your response.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirmPayment = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/bookings/${bookingId}/confirm-payment-client`, {
//         method: 'POST',
//       });

//       if (!res.ok) throw new Error('Failed to confirm payment');

//       setSuccess("Payment confirmation sent! Our team will verify and confirm your booking shortly.");
//     } catch (err) {
//       setError("Failed to send payment confirmation");
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

//   return (
//     <div className="container max-w-2xl mx-auto p-6">
//       <Card>
//         <CardContent className="pt-6 space-y-6">
//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//               <p className="text-red-800">{error}</p>
//             </div>
//           )}

//           {success && (
//             <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//               <CheckCircle className="h-5 w-5 text-green-600 inline mr-2" />
//               <span className="text-green-800">{success}</span>
//             </div>
//           )}

//           {booking && (
//             <div className="space-y-2">
//               <p className="text-lg">
//                 Proposed Cost: <strong>${booking.proposed_cost ? booking.proposed_cost.toFixed(2) : 'Not set'}</strong>
//               </p>
//               <p className="text-sm text-muted-foreground">
//                 Event: {booking.event_type || 'N/A'} | {new Date(booking.event_date).toLocaleDateString()}
//               </p>
//             </div>
//           )}

//           {/* Accept Action */}
//           {action === 'accept' && !showBankDetails && (
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
//                     Processing...
//                   </>
//                 ) : (
//                   "Confirm & View Payment Details"
//                 )}
//               </Button>
//             </div>
//           )}

//           {/* Bank Details Display */}
//           {showBankDetails && (
//             <div className="space-y-6">
//               <div className="border-2 border-gray-800 rounded-lg p-6">
//                 <div className="flex items-center gap-2 mb-4">
//                   <Building2 className="h-6 w-6 text-amber-600" />
//                   <h3 className="text-lg font-semibold text-amber-900">Bank Transfer Details</h3>
//                 </div>

//                 <div className="space-y-3">
//                   <div className="flex justify-between py-2 border-b">
//                     <span className="text-muted-foreground">Amount to Pay:</span>
//                     <strong className="text-xl text-amber-700">${booking?.proposed_cost?.toFixed(2)}</strong>
//                   </div>
//                   <div className="flex justify-between py-2 border-b">
//                     <span>Bank Name:</span>
//                     <strong>{BANK_DETAILS.bankName}</strong>
//                   </div>
//                   <div className="flex justify-between py-2 border-b">
//                     <span>Account Name:</span>
//                     <strong>{BANK_DETAILS.accountName}</strong>
//                   </div>
//                   <div className="flex justify-between py-2 border-b">
//                     <span>Account Number:</span>
//                     <strong className="font-mono">{BANK_DETAILS.accountNumber}</strong>
//                   </div>
//                   {BANK_DETAILS.routingNumberACH && (
//                     <div className="flex justify-between py-2">
//                       <span>Routing Number (for ACH & Direct Deposits):</span>
//                       <strong className="font-mono">{BANK_DETAILS.routingNumberACH}</strong>
//                     </div>
//                   )}
//                   {BANK_DETAILS.routingNumberWire && (
//                     <div className="flex justify-between py-2">
//                       <span>Routing Number (for Wire Transfer):</span>
//                       <strong className="font-mono">{BANK_DETAILS.routingNumberWire}</strong>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="border border-gray-800 rounded-lg p-4">
//                 <p className="text-sm text-blue-900 font-medium mb-2">📌 Important:</p>
//                 <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
//                   <li>Include your full name in the transfer reference</li>
//                   <li>Keep your payment receipt/confirmation</li>
//                   <li>Click "I Have Made Payment" after transferring</li>
//                 </ul>
//               </div>

//               {!booking?.payment_confirmed_by_client ? (
//                 <Button
//                   onClick={handleConfirmPayment}
//                   disabled={loading}
//                   className="w-full"
//                   size="lg"
//                 >
//                   {loading ? (
//                     <>
//                       <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                       Sending Confirmation...
//                     </>
//                   ) : (
//                     <>
//                       <CreditCard className="mr-2 h-5 w-5" />
//                       I Have Made Payment
//                     </>
//                   )}
//                 </Button>
//               ) : (
//                 <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
//                   <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
//                   <p className="font-semibold text-green-900">Payment Confirmation Sent!</p>
//                   <p className="text-sm text-green-700 mt-1">
//                     Our team will verify your payment and confirm your booking shortly.
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Counter Offer */}
//           {action === 'counter' && (
//             <div className="space-y-4">
//               <p>Make a counter offer:</p>
//               <input
//                 type="number"
//                 step="0.01"
//                 placeholder="Your counter offer (e.g., 1200.00)"
//                 value={counterOffer}
//                 onChange={(e) => setCounterOffer(e.target.value)}
//                 className="w-full px-4 py-2 border rounded-lg"
//               />
//               <Button
//                 onClick={() => handleResponse('counter')}
//                 disabled={loading || !counterOffer}
//                 className="w-full"
//               >
//                 {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
//                 Send Counter Offer
//               </Button>
//             </div>
//           )}

//           {/* Cancel */}
//           {action === 'cancel' && (
//             <div className="space-y-4">
//               <p className="text-destructive font-medium">Cancel this booking?</p>
//               <Button
//                 variant="destructive"
//                 onClick={() => handleResponse('cancel')}
//                 disabled={loading}
//                 className="w-full"
//               >
//                 {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
//                 Confirm Cancellation
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
import { useSearchParams, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Loader2,
  Building2,
  CreditCard,
  Smartphone,
  Upload,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BANK_DETAILS, PAYMENT_OPTIONS } from "@/lib/bank-details";
import Image from "next/image";

export default function BookingResponsePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const bookingId = params.id as string;
  const action = searchParams.get("action");

  const [booking, setBooking] = useState<any>(null);
  const [counterOffer, setCounterOffer] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setError("Booking ID not found");
        setFetchLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        if (!res.ok) throw new Error("Failed to fetch booking");
        const data = await res.json();
        setBooking(data);
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError("Failed to load booking details");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchBooking();

    // Poll for status updates when payment is processing
    let interval: NodeJS.Timeout;
    if (booking?.status === "payment_processing") {
      interval = setInterval(fetchBooking, 5000); // Check every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [bookingId, booking?.status]);

  const handleResponse = async (responseAction: string) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/bookings/${bookingId}/client-response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: responseAction,
          counter_offer:
            responseAction === "counter" ? parseFloat(counterOffer) : undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to process response");
      }

      if (responseAction === "accept") {
        setSuccess("Proposal accepted! Please select a payment method below.");
      } else if (responseAction === "counter") {
        setSuccess("Counter offer submitted successfully!");
      } else if (responseAction === "cancel") {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProofFile(e.target.files[0]);
    }
  };

  const handleConfirmPayment = async () => {
    if (!paymentProofFile) {
      setError("Please upload payment proof before confirming");
      return;
    }

    setUploadingProof(true);
    setError("");

    try {
      // Upload proof
      const formData = new FormData();
      formData.append("file", paymentProofFile);
      formData.append("bookingId", bookingId);

      const uploadRes = await fetch("/api/upload-payment-proof", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Failed to upload proof");

      const { url } = await uploadRes.json();

      // Confirm payment with proof URL
      const res = await fetch(
        `/api/bookings/${bookingId}/confirm-payment-client`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payment_method: selectedPaymentMethod,
            payment_proof_url: url,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to confirm payment");

      // Refresh booking
      const updatedRes = await fetch(`/api/bookings/${bookingId}`);
      const updatedData = await updatedRes.json();
      setBooking(updatedData);

      setSuccess("Payment proof submitted successfully!");
    } catch (err) {
      setError("Failed to submit payment confirmation");
    } finally {
      setUploadingProof(false);
    }
  };

  const getPaymentIcon = (iconName: string) => {
    switch (iconName) {
      case "Building2":
        return <Building2 className="h-6 w-6" />;
      case "Smartphone":
        return <Smartphone className="h-6 w-6" />;
      case "CreditCard":
        return <CreditCard className="h-6 w-6" />;
      default:
        return null;
    }
  };

  if (fetchLoading) {
    return (
      <div className="container max-w-2xl mx-auto p-6 flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Payment Processing Status
  if (booking?.status === "payment_processing") {
    return (
      <div className="container max-w-2xl mx-auto p-6 min-h-screen flex items-center justify-center">
        <Card className="w-full">
          <CardContent className="pt-6 text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <Loader2 className="h-16 w-16 animate-spin text-amber-600" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <CreditCard className="h-8 w-8 text-amber-600" />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Payment Processing</h2>
              <p className="text-muted-foreground">
                Our team is verifying your payment. This usually takes a few
                minutes.
              </p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-900 dark:text-amber-100">
                You'll receive a confirmation email once verified
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Payment Confirmed Status
  if (
    booking?.status === "payment_confirmed" ||
    booking?.payment_confirmed_by_admin
  ) {
    return (
      <div className="container max-w-2xl mx-auto p-6 min-h-screen flex items-center justify-center">
        <Card className="w-full">
          <CardContent className="pt-6 text-center space-y-6">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                Payment Confirmed!
              </h2>
              <p className="text-muted-foreground">
                Your booking is now confirmed. Check your email for details.
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-green-900 dark:text-green-100">
                Your event has been added to our schedule
                <br />
                We'll contact you closer to the date with final details
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <Card>
        <CardContent className="pt-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <CheckCircle className="h-5 w-5 text-green-600 inline mr-2" />
              <span className="text-green-800 dark:text-green-200">
                {success}
              </span>
            </div>
          )}

          {booking && (
            <div className="space-y-2">
              <p className="text-lg">
                Proposed Cost:{" "}
                <strong>
                  $
                  {booking.proposed_cost
                    ? booking.proposed_cost.toFixed(2)
                    : "Not set"}
                </strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Event: {booking.event_type || "N/A"} |{" "}
                {new Date(booking.event_date).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Accept Action - Show payment method selection */}
          {action === "accept" &&
            booking?.status !== "awaiting_payment" &&
            !selectedPaymentMethod && (
              <div className="space-y-4">
                <p>You're about to accept this proposal.</p>
                <Button
                  onClick={() => handleResponse("accept")}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm & View Payment Options"
                  )}
                </Button>
              </div>
            )}

          {/* Payment Method Selection */}
          {booking?.status === "awaiting_payment" && !selectedPaymentMethod && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Payment Method</h3>
              <div className="grid gap-3">
                {PAYMENT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedPaymentMethod(option.id)}
                    className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover:border-primary transition-colors dark:border-gray-700 dark:hover:border-primary"
                  >
                    {getPaymentIcon(option.icon)}
                    <span className="font-medium">{option.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Payment Details Display */}
          {selectedPaymentMethod && !booking?.payment_confirmed_by_client && (
            <div className="space-y-6">
              {/* Bank Transfer */}
              {selectedPaymentMethod === "bank_transfer" && (
                <div className=" border-2 border-amber-300 dark:border-amber-800 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="h-6 w-6 text-amber-600" />
                    <h3 className="text-lg font-semibold">
                      Bank Transfer Details
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b dark:border-gray-700">
                      <span className="text-muted-foreground">Amount:</span>
                      <strong className="text-xl">
                        ${booking?.proposed_cost?.toFixed(2)}
                      </strong>
                    </div>
                    <div className="flex justify-between py-2 border-b dark:border-gray-700">
                      <span>Bank Name:</span>
                      <strong>{BANK_DETAILS.bankName}</strong>
                    </div>
                    <div className="flex justify-between py-2 border-b dark:border-gray-700">
                      <span>Account Name:</span>
                      <strong>{BANK_DETAILS.accountName}</strong>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Account Number:</span>
                      <strong className="font-mono">
                        {BANK_DETAILS.accountNumber}
                      </strong>
                    </div>
                  </div>
                  {BANK_DETAILS.routingNumberACH && (
                    <div className="flex justify-between py-2">
                      <span>Routing Number (for ACH & Direct Deposits):</span>
                      <strong className="font-mono">
                        {BANK_DETAILS.routingNumberACH}
                      </strong>
                    </div>
                  )}
                  {BANK_DETAILS.routingNumberWire && (
                    <div className="flex justify-between py-2">
                      <span>Routing Number (for Wire Transfer):</span>
                      <strong className="font-mono">
                        {BANK_DETAILS.routingNumberWire}
                      </strong>
                    </div>
                  )}
                </div>
              )}

              {/* Zelle QR */}
              {selectedPaymentMethod === "zelle" && (
                <div className="bg-purple-50 dark:bg-purple-950 border-2 border-purple-300 dark:border-purple-800 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Smartphone className="h-6 w-6 text-purple-600" />
                    <h3 className="text-lg font-semibold">Pay with Zelle</h3>
                  </div>
                  <p className="text-sm mb-4 text-muted-foreground">
                    Scan this code in your bank's app
                  </p>
                  <Image
                    src="/payment-qr/zelle-qr.png"
                    alt="Zelle QR Code"
                    width={300}
                    height={300}
                    className="mx-auto rounded-lg"
                  />
                  <p className="text-xl font-bold mt-4">
                    ${booking?.proposed_cost?.toFixed(2)}
                  </p>
                </div>
              )}

              {/* PayPal QR */}
              {selectedPaymentMethod === "paypal" && (
                <div className="bg-blue-50 dark:bg-blue-950 border-2 border-blue-300 dark:border-blue-800 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-semibold">Pay with PayPal</h3>
                  </div>
                  <p className="text-sm mb-4 text-muted-foreground">
                    Scan this code with your PayPal app
                  </p>
                  <p className="text-sm mb-4 text-muted-foreground">
                    Email: ultrabandmusic@gmail.com
                  </p>
                  <Image
                    src="/payment-qr/paypal-qr.png"
                    alt="PayPal QR Code"
                    width={300}
                    height={300}
                    className="mx-auto rounded-lg"
                  />
                  <p className="text-xl font-bold mt-4">
                    ${booking?.proposed_cost?.toFixed(2)}
                  </p>
                </div>
              )}

              {/* Upload Payment Proof */}
              <div className="space-y-4">
                <div className=" border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">
                    Upload Payment Proof:
                  </p>
                  <ul className="text-sm space-y-1 list-disc list-inside text-blue-800 dark:text-blue-200">
                    <li>Screenshot of transaction</li>
                    <li>Bank receipt or confirmation</li>
                    <li>Any proof showing payment completed</li>
                  </ul>
                </div>

                <div className="border-2 border-dashed rounded-lg p-6 text-center dark:border-gray-700">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="payment-proof"
                  />
                  <label htmlFor="payment-proof" className="cursor-pointer">
                    {paymentProofFile ? (
                      <div className="space-y-2">
                        <Check className="h-8 w-8 text-green-600 mx-auto" />
                        <p className="font-medium">{paymentProofFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Click to change file
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="font-medium">
                          Click to upload payment proof
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG or PDF (max 5MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>

                <Button
                  onClick={handleConfirmPayment}
                  disabled={uploadingProof || !paymentProofFile}
                  className="w-full cursor-pointer"
                  size="lg"
                >
                  {uploadingProof ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />I Have Made Payment
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setSelectedPaymentMethod(null)}
                  className="w-full cursor-pointer"
                >
                  Choose Different Method
                </Button>
              </div>
            </div>
          )}

          {/* Counter Offer */}
          {action === "counter" && (
            <div className="space-y-4">
              <p>Make a counter offer:</p>
              <input
                type="number"
                step="0.01"
                placeholder="Your counter offer (e.g., 1200.00)"
                value={counterOffer}
                onChange={(e) => setCounterOffer(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
              <Button
                onClick={() => handleResponse("counter")}
                disabled={loading || !counterOffer}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Send Counter Offer
              </Button>
            </div>
          )}

          {/* Cancel */}
          {action === "cancel" && (
            <div className="space-y-4">
              <p className="text-destructive font-medium">
                Cancel this booking?
              </p>
              <Button
                variant="destructive"
                onClick={() => handleResponse("cancel")}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Confirm Cancellation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
