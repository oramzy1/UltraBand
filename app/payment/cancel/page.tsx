"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="container max-w-2xl mx-auto p-6 min-h-screen flex items-center justify-center">
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <XCircle className="h-16 w-16 mx-auto text-orange-500" />
            <h1 className="text-2xl font-bold">Payment Cancelled</h1>
            <p className="text-muted-foreground">
              You cancelled the payment process. No charges were made.
            </p>
            <p className="text-sm text-muted-foreground">
              If you encountered any issues or have questions, please contact us.
            </p>
            <div className="flex gap-4 justify-center mt-6">
              <Button onClick={() => router.push("/")}>
                Return to Home
              </Button>
              <Button variant="outline" onClick={() => router.push("/contact")}>
                Contact Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}