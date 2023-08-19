import z from 'zod';

export const getListDetailsResponseSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	id: z.string()
});

export type GetListDetailsResponse = z.infer<typeof getListDetailsResponseSchema>;
export const getListDetailsArrayResponseSchema = getListDetailsResponseSchema.array();
export type GetListDetailsArrayResponse = z.infer<typeof getListDetailsArrayResponseSchema>;
