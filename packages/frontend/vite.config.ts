import { sveltekit } from '@sveltejs/kit/vite';
import topLevelAwait from 'vite-plugin-top-level-await';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit(), topLevelAwait()],
	test: {
		include: ['tests/**/*.{test,spec}.{js,ts}']
	}
});
