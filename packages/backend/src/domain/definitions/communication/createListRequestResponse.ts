import z from 'zod';

export const createListRequestSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	itemIds: z.string().array()
});
export type CreateListRequest = z.infer<typeof createListRequestSchema>;

export const createListResponseSchema = z.object({ id: z.string() }).and(createListRequestSchema);
export type CreateListResponse = z.infer<typeof createListResponseSchema>;

export const getListsResponseSchema = z
	.object({
		name: z.string(),
		description: z.string().nullable(),
		id: z.string(),
		itemIds: z.string().array().default([])
	})
	.array();
