'use server';
/**
 * @fileOverview Generates an order confirmation notification.
 *
 * - generateOrderConfirmation - A function that generates a friendly order confirmation message.
 * - OrderConfirmationInput - The input type for the generateOrderConfirmation function.
 * - OrderConfirmationOutput - The return type for the generateOrderConfirmation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getOrderById } from '@/lib/firestore';

const OrderSchemaForTool = z.object({
    id: z.string().optional(),
    userId: z.string(),
    date: z.string().describe("The date the order was placed in ISO format."),
    items: z.array(z.object({
        productId: z.string(),
        quantity: z.number(),
        price: z.number(),
    })),
    total: z.number(),
    deliveryFee: z.number(),
    deliveryAddress: z.string(),
    status: z.enum(["Processing", "Shipped", "Delivered", "Cancelled"]),
    customerName: z.string(),
    customerPhone: z.string(),
    orderNumber: z.number().optional(),
});


const getOrderByIdTool = ai.defineTool(
    {
        name: 'getOrderById',
        description: 'Retrieves the details of an order given its ID.',
        inputSchema: z.object({ orderId: z.string() }),
        outputSchema: OrderSchemaForTool,
    },
    async ({ orderId }) => {
        const order = await getOrderById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        // Convert Date to ISO string for Zod compatibility and return
        const { date, createdAt, updatedAt, ...restOfOrder } = order;
        return {
            ...restOfOrder,
            date: date.toISOString(),
        };
    }
);


const OrderConfirmationInputSchema = z.object({
  orderId: z.string().describe('The ID of the order to confirm.'),
});
export type OrderConfirmationInput = z.infer<typeof OrderConfirmationInputSchema>;

const OrderConfirmationOutputSchema = z.object({
    title: z.string().describe('The title of the notification message.'),
    message: z.string().describe('The body of the notification message.'),
});
export type OrderConfirmationOutput = z.infer<typeof OrderConfirmationOutputSchema>;

export async function generateOrderConfirmation(input: OrderConfirmationInput): Promise<OrderConfirmationOutput> {
  return orderConfirmationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'orderConfirmationPrompt',
  input: { schema: OrderConfirmationInputSchema },
  output: { schema: OrderConfirmationOutputSchema },
  tools: [getOrderByIdTool],
  prompt: `You are a friendly AI assistant for Nairobi Grocer.
  
  A customer has just placed an order. Your task is to generate a confirmation message.
  
  First, use the getOrderById tool to get the details for order ID: {{orderId}}.
  
  Then, write a short, friendly, and reassuring confirmation message for the customer.
  - The title should be "Order Confirmed!".
  - The message should mention the order number and the total amount.
  - Reassure them that their order is being processed and will be delivered soon.
  - Do not list the items.
  - The tone should be warm and professional.

  Respond in JSON.
  `,
});

const orderConfirmationFlow = ai.defineFlow(
  {
    name: 'orderConfirmationFlow',
    inputSchema: OrderConfirmationInputSchema,
    outputSchema: OrderConfirmationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
