"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface CardPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentInitiate: (cardDetails: any) => void; // Replace 'any' with a more specific type for card details
}

const CardPaymentModal: React.FC<CardPaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  onPaymentInitiate,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePaymentInitiate = async () => {
    setIsLoading(true);
    // Placeholder for Stripe Elements and payment logic
    console.log('Initiating card payment for amount:', amount);
    console.log('Card Details:', { cardNumber, expiryDate, cvc });

    // TODO:
    // 1. Use Stripe Elements to securely collect card details.
    //    Do NOT send raw card details to your server.
    // 2. Create a PaymentMethod using Stripe.js.
    // 3. Send the PaymentMethod ID and amount to your backend.
    // 4. On the backend, create a PaymentIntent and confirm it with the PaymentMethod ID.
    // 5. Handle the payment confirmation response from the backend.

    // Example placeholder call to the parent component's handler
    // onPaymentInitiate({ cardNumber, expiryDate, cvc });

    // Simulate a delay for demonstration
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsLoading(false);
    // You would typically close the modal after a successful payment or
    // show an error message on failure.
    // onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Card Payment</DialogTitle>
          <DialogDescription>
            Enter your card details to complete the payment for ${amount.toFixed(2)}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            {/* TODO: Replace with Stripe Card Element */}
            <Input
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="•••• •••• •••• ••••"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              {/* TODO: Replace with Stripe Card Expiry Element */}
              <Input
                id="expiryDate"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              {/* TODO: Replace with Stripe Card CVC Element */}
              <Input
                id="cvc"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                placeholder="•••"
              />
            </div>
          </div>
          {/* Placeholder for Stripe Elements container */}
          {/* <div id="card-element"></div> */}
        </div>
        <DialogFooter>
          <Button onClick={handlePaymentInitiate} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Initiate Payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CardPaymentModal;