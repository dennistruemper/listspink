export class TestGlobalConstants {
	static getLatestURL(): string {
		const urlRaw = process.env.FRONTEND_URL;
		if (urlRaw !== undefined) {
			return urlRaw;
		}

		if (process.env.CI === 'true') {
			throw new Error('FRONTEND_URL is not set in CI');
		}
		// use latest deplyment if no url value is set in dev setup
		return 'https://listspink-vercel-rochdigital.vercel.app';
	}
}
