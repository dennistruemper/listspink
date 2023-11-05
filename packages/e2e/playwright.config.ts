import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	/* use deployed version instead
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},*/
	use: {
		video: 'retain-on-failure'
	},
	testDir: 'test',
	testMatch: /(.+\.)?(e2e)\.[t]s/
};

export default config;
