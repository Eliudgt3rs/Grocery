'use server';

/**
 * @fileOverview Provides product recommendations based on cart items and order history.
 *
 * - getSmartRecommendations - A function to fetch smart product recommendations.
 * - SmartRecommendationsInput - The input type for the getSmartRecommendations function.
 * - SmartRecommendationsOutput - The return type for the getSmartRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartRecommendationsInputSchema = z.object({
  cartItems: z.array(
    z.object({
      productId: z.string().describe('The ID of the product in the cart.'),
      quantity: z.number().describe('The quantity of the product in the cart.'),
    })
  ).describe('The items currently in the user\'s cart.'),
  orderHistory: z.array(
    z.object({
      productId: z.string().describe('The ID of the product in the order.'),
      quantity: z.number().describe('The quantity of the product in the order.'),
      orderDate: z.string().describe('The date the order was placed.'),
    })
  ).describe('The user\'s past order history.'),
  numberOfRecommendations: z.number().default(3).describe('The desired number of product recommendations.'),
});
export type SmartRecommendationsInput = z.infer<typeof SmartRecommendationsInputSchema>;

const SmartRecommendationsOutputSchema = z.array(
  z.object({
    productId: z.string().describe('The ID of the recommended product.'),
    reason: z.string().describe('The reason why this product is recommended.'),
  })
).describe('A list of product recommendations.');
export type SmartRecommendationsOutput = z.infer<typeof SmartRecommendationsOutputSchema>;

export async function getSmartRecommendations(input: SmartRecommendationsInput): Promise<SmartRecommendationsOutput> {
  return smartRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartRecommendationsPrompt',
  input: {schema: SmartRecommendationsInputSchema},
  output: {schema: SmartRecommendationsOutputSchema},
  prompt: `You are an AI assistant specializing in providing product recommendations for a grocery store.

  Based on the customer's current cart items and past order history, provide {{numberOfRecommendations}} product recommendations.
  Explain the reason for each recommendation.

  Current Cart Items:
  {{#each cartItems}}
  - Product ID: {{productId}}, Quantity: {{quantity}}
  {{/each}}

  Past Order History:
  {{#each orderHistory}}
  - Product ID: {{productId}}, Quantity: {{quantity}}, Order Date: {{orderDate}}
  {{/each}}

  Recommendations (respond in JSON):
  `,
});

const smartRecommendationsFlow = ai.defineFlow(
  {
    name: 'smartRecommendationsFlow',
    inputSchema: SmartRecommendationsInputSchema,
    outputSchema: SmartRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
