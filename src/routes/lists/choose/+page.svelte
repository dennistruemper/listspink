<script lang="ts">
	import { goto } from '$app/navigation';
	import ActionBar from '../../../components/actionBar.svelte';
	import FadeIn from '../../../components/animation/fadeIn.svelte';
	import ActionBarBackButton from '../../../components/buttons/actionBarBackButton.svelte';
	import ActionBarButton from '../../../components/buttons/actionBarButton.svelte';
	import { appStore } from '../../../stores/appStore';
	import { titleStore } from '../../../stores/titleStore';
	import Plus from '../../../svg/plus.svelte';
	import {
		divideWithBackground,
		itemBackground,
		itemDisabled,
		itemHoverBackground,
		itemHoveredBackground,
		textColor,
		textHoveredColr
	} from '../../../theme';
	import { Routes } from '../../routes';
	console.log($appStore.current);
	$: lists = $appStore.current.lists ?? [];

	titleStore.set({ title: 'Choose List', listChooseMode: false });
</script>

<FadeIn>
	<ul class="divide-y {divideWithBackground} overflow-hidden {itemBackground} shadow-md rounded-xl">
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
				class="relative flex justify-between gap-x-6 px-4 py-5 group
            {list.id === $appStore.current.currentList?.id
					? itemHoveredBackground + textHoveredColr
					: ''}"
			>
				<p>{list.name}</p>
				<div>
					{#if list.id !== $appStore.current.currentList?.id}
						<button
							class="p-2 rounded-lg {itemHoveredBackground + textHoveredColr}"
							on:click={() => {
								goto(Routes.editList({ listId: list.id }));
							}}>Edit</button
						>
						<button
							class="p-2 rounded-lg {itemHoveredBackground + textHoveredColr}"
							on:click={() => {
								appStore.dispatch({ type: 'choose_list_by_id', listId: list.id });
								goto('/');
							}}>Choose</button
						>
					{:else}
						<button
							class="p-2 rounded-lg {itemBackground + textColor}"
							on:click={() => {
								goto(Routes.editList({ listId: list.id }));
							}}>Edit</button
						>
						<button
							class="p-2 rounded-lg {itemDisabled + textColor}"
							disabled={true}
							on:click={() => {
								appStore.dispatch({ type: 'choose_list_by_id', listId: list.id });
								goto('/');
							}}>Choose</button
						>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
</FadeIn>
<ActionBar>
	<div class="w-full h-full flex items-center justify-between px-4 sm:px-16">
		<ActionBarBackButton />
		<ActionBarButton
			onClick={() => {
				goto(Routes.createList);
			}}><Plus /> Create List</ActionBarButton
		>
	</div>
</ActionBar>
