import z from 'zod';

export const createListRequestSchema = z.object({
	name: z.string(),
	description: z.string().optional()
});
export type CreateListRequest = z.infer<typeof createListRequestSchema>;

export const createListResponseSchema = z.object({ id: z.string() }).and(createListRequestSchema);
export type CreateListResponse = z.infer<typeof createListResponseSchema>;
