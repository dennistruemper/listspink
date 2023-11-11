import z from 'zod';

export const getItemDetailsResponseSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	id: z.string(),
	priority: z.number()
});

export type GetItemDetailsResponse = z.infer<typeof getItemDetailsResponseSchema>;
export const getItemDetailsArrayResponseSchema = getItemDetailsResponseSchema.array();
export type GetItemDetailsArrayResponse = z.infer<typeof getItemDetailsArrayResponseSchema>;
