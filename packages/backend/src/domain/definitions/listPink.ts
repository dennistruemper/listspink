import { z } from 'zod';

export const listPinkDetailsSchema = z.object({
	name: z.string(),
	description: z.string().nullable(),
	id: z.string()
});
export type ListPinkDetails = z.infer<typeof listPinkDetailsSchema>;

export const listPinkSchema = z.object({
	name: z.string(),
	description: z.string().nullable(),
	id: z.string(),
	itemIds: z.string().array().default([])
});

export const listsPinkSchema = z.array(listPinkSchema);

export type ListPink = z.infer<typeof listPinkSchema>;
