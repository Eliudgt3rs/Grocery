import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface MPesaPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentInitiate: (phoneNumber: string, amount: number) => void;
}

const MPesaPaymentModal: React.FC<MPesaPaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  onPaymentInitiate,
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    if (!phoneNumber) return;
    setIsProcessing(true);

    // Simulate payment process
    setTimeout(() => {
      onPaymentInitiate(phoneNumber, amount);
      setIsProcessing(false);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pay with M-Pesa</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="mpesa-phone">Phone Number</Label>
            <Input
              id="mpesa-phone"
              type="tel"
              placeholder="e.g. 0712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isProcessing}
            />
          </div>
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input value={`KES ${amount.toFixed(2)}`} disabled />
          </div>
          <Button onClick={handlePayment} disabled={!phoneNumber || isProcessing}>
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isProcessing ? "Processing..." : "Initiate Payment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MPesaPaymentModal;
