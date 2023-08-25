export function getUserIdFromRequest(req: unknown): string | undefined {
	const maybeRequestWithUser = req as {
		auth?: { payload?: { sub?: string }; sessionClaims?: { sub?: string } };
	};

	return maybeRequestWithUser.auth?.sessionClaims?.sub ?? maybeRequestWithUser?.auth?.payload?.sub;
}
