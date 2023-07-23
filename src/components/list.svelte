<script lang="ts">
	import { divideWithBackground, itemBackground, itemHoverBackground } from '../theme';

	// eslint-disable-next-line no-undef
	type T = $$Generic;

	export let items: T[];
</script>

<ul
	role="list"
	class="divide-y {divideWithBackground} overflow-hidden {itemBackground} shadow-md rounded-xl"
>
	{#each items as item}
		<li class="relative flex justify-between gap-x-6 px-4 py-5 group {itemHoverBackground} sm:px-">
			<slot {item} />
		</li>
	{/each}
</ul>
