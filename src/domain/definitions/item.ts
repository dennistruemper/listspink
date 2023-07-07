import { z } from 'zod';

const itemSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	completed: z.string().datetime({ offset: false }).optional()
});

export type Item = z.infer<typeof itemSchema>;

function checkItem(item: Item): string | undefined {
	const parsed = itemSchema.safeParse(item);
	if (parsed.success === false) {
		return parsed.error.message;
	}
}
