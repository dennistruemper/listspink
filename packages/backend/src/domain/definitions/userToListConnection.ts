import { z } from 'zod';
export const userToListConnectionSchema = z.object({
	userId: z.string(),
	listId: z.string()
});
export type UserToListConnection = z.infer<typeof userToListConnectionSchema>;
