import type { LoadEvent } from '@sveltejs/kit';
export const load = (input: LoadEvent) => {
	return {
		itemId: input.params.itemId
	};
};
