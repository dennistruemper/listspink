import z from 'zod';

export const getListDetailsRequestSchema = z.object({
	id: z.string()
});
export type GetListDetailsRequest = z.infer<typeof getListDetailsRequestSchema>;

export const getListDetailsResponseSchema = z
	.object({ name: z.string(), description: z.string().optional(), id: z.string() })
	.and(getListDetailsRequestSchema);
export type GetListDetailsResponse = z.infer<typeof getListDetailsResponseSchema>;
