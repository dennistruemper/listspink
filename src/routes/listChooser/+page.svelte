<script lang="ts">
	import { appStore } from '../../stores/appStore';
	import { titleStore } from '../../stores/titleStore';
	import {
		divideWithBackground,
		itemBackground,
		itemHoverBackground,
		itemHoveredBackground,
		textHoveredColr
	} from '../../theme';
	console.log($appStore.current);
	$: lists = $appStore.current.lists ?? [];

	titleStore.set({ title: 'Choose List', listChooseMode: false });
</script>

<ul
	role="list"
	class="divide-y {divideWithBackground} overflow-hidden {itemBackground} shadow-md rounded-xl"
>
	{#if $appStore.debugMode}
		<li class="relative flex justify-between gap-x-6 px-4 py-5 group {itemHoverBackground} ">
			<button
				class=" w-full h-full"
				on:click={() =>
					appStore.dispatch({
						type: 'create_list',
						name: 'New List ' + new Date().toISOString()
					})}>Quick Add List (DEBUG)</button
			>
		</li>
	{/if}
	{#each lists as list}
		<li
			class="relative flex justify-between gap-x-6 px-4 py-5 group {itemHoverBackground}
            {list.id === $appStore.current.currentList?.id
				? itemHoveredBackground + textHoveredColr
				: ''}"
		>
			<p>{list.name}</p>
			{#if list.id !== $appStore.current.currentList?.id}
				<button
					class="p-2 rounded-lg {itemHoveredBackground + textHoveredColr}"
					on:click={() => appStore.dispatch({ type: 'choose_list_by_id', listId: list.id })}
					>Choose</button
				>
			{/if}
		</li>
	{/each}
</ul>
