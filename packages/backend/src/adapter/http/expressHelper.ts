export function getUserIdFromRequest(req: unknown): string | undefined {
	const maybeRequestWithUser = req as { auth?: { payload?: { sub?: string } } };

	return maybeRequestWithUser?.auth?.payload?.sub;
}
