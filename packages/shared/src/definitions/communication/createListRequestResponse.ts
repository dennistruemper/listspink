import z from 'zod';

export const createListRequestSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	itemIds: z.string().array().optional().default([])
});
export type CreateListRequest = z.infer<typeof createListRequestSchema>;

export const createListResponseSchema = z
	.object({ id: z.string(), itemIds: z.string().array().optional().default([]) })
	.and(createListRequestSchema);
export type CreateListResponse = z.infer<typeof createListResponseSchema>;
