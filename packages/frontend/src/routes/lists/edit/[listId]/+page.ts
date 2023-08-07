import type { LoadEvent } from '@sveltejs/kit';
export const load = (input: LoadEvent) => {
	return {
		listId: input.params.listId
	};
};
