import { z } from 'zod';

export const itemSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	description: z.string().optional(),
	completed: z.string().datetime({ offset: false }).optional()
});

export type ItemPink = z.infer<typeof itemSchema>;

function checkItem(item: ItemPink): string | undefined {
	const parsed = itemSchema.safeParse(item);
	if (parsed.success === false) {
		return parsed.error.message;
	}
}

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
