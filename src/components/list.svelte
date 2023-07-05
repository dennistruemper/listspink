<script lang="ts">
	type T = $$Generic;

	export let items: T[];

	interface $$Slots {
		default: { item: T };
	}
</script>

<ul
	role="list"
	class="divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden bg-pink-300 dark:bg-purple-700 shadow-sm ring-1 ring-gray-900/5 rounded-xl"
>
	{#each items as item}
		<li
			class="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-pink-500 dark:hover:bg-purple-800 sm:px-"
		>
			<slot {item} />
		</li>
	{/each}
</ul>
