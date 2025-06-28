"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface MPesaPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentInitiate: (phoneNumber: string, amount: number) => void;
}

export default function MPesaPaymentModal({
  isOpen,
  onClose,
  amount,
  onPaymentInitiate,
}: MPesaPaymentModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setPhoneNumber("");
    }
  }, [isOpen]);

  const handlePayment = () => {
    if (!phoneNumber) return;

    onPaymentInitiate(phoneNumber, amount);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pay with M-Pesa</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 0712345678"
              required
            />
          </div>
          <p className="text-sm text-muted-foreground">
            You’ll receive a prompt for KES {amount.toFixed(2)} to your phone.
          </p>
          <Button
            className="w-full mt-2"
            onClick={handlePayment}
            disabled={!phoneNumber}
          >
            Initiate Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
