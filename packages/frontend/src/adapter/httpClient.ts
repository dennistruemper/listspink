import type { z } from 'zod';

export function parseResponse<O extends object>(
	input: Response,
	schema: z.ZodSchema<O>
): { data: O; success: true } | { error: string; success: false } {
	console.log('input', input);
	const parsed = schema.safeParse(input);
	if (parsed.success) {
		return { success: true, data: parsed.data };
	} else {
		return { success: false, error: parsed.error.message };
	}
}
