import { z } from 'zod';

export const itemSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	completed: z.string().datetime({ offset: false }).optional()
});

export type ItemPink = z.infer<typeof itemSchema>;

export function createItemPink(input: {
	name: string;
	uuidGenerator: () => string;
	description?: string;
}): ItemPink {
	return {
		id: input.uuidGenerator(),
		name: input.name,
		description: input.description
	};
}
