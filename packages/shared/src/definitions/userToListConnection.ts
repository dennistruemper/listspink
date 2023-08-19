import { z } from 'zod';
export const userToListConnectionSchema = z.object({
	userId: z.string(),
	listId: z.string(),
	listName: z.string(),
	listDescription: z.string().optional()
});
export type ListPinkDetails = z.infer<typeof userToListConnectionSchema>;
export type UserToListConnection = z.infer<typeof userToListConnectionSchema>;
