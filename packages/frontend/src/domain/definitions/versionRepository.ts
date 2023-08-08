export interface VersionRepository {
	getVersion(): Promise<
		{ success: true; data: { version: string } } | { success: false; error: string }
	>;
}
