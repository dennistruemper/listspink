import { sveltekit } from '@sveltejs/kit/vite';
import topLevelAwait from 'vite-plugin-top-level-await';
import { defineConfig } from 'vitest/config';

function patternFromMode(mode: string | undefined, basePath: string) {
	switch (mode) {
		case 'ALL':
			return `${basePath}/test/**/*.{local,sandbox}.ts`;
		case 'SANDBOX':
			return `${basePath}/test/**/*.sandbox.ts`;
		case 'LOCAL':
		default:
			return `${basePath}/test/**/*.local.ts`;
	}
}

export default defineConfig({
	plugins: [sveltekit(), topLevelAwait()],
	test: {
		include: [patternFromMode(process.env.MODE, process.env.BASE_PATH ?? '.')],
		testTimeout: 10000
	}
});
