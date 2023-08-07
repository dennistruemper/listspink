<script lang="ts">
	import { goto } from '$app/navigation';
	import ActionBar from '../components/actionBar.svelte';
	import FadeIn from '../components/animation/fadeIn.svelte';
	import ActionBarButton from '../components/buttons/actionBarButton.svelte';
	import List from '../components/list.svelte';
	import ListItem from '../components/listItem.svelte';
	import { appStore } from '../stores/appStore';
	import { titleStore } from '../stores/titleStore';
	import Plus from '../svg/plus.svelte';

	$: currentList = $appStore.current.currentList;
	$: currentListName = currentList?.name;

	$: titleStore.set({
		title: currentListName ?? 'Create List',
		listChooseMode: true
	});
	let showCompleted = false;
	$: activeItems = $appStore.current.currentList?.activeItems ?? [];
	$: completedItems = $appStore.current.currentList?.completedItems ?? [];
</script>

<FadeIn>
	<div class="flex flex-row justify-between">
		<h2 class="text-2xl font-semibold">Active Items</h2>

		{#if completedItems !== undefined && completedItems.length > 0}
			<div class="flex flex-row items-center gap-2 px-1">
				<p>Show Completed</p>
				<input
					type="checkbox"
					checked={showCompleted}
					on:change={() => {
						showCompleted = !showCompleted;
					}}
				/>
			</div>
		{/if}
	</div>
	{#if activeItems.length === 0}
		<div class="p-8 w-full">
			<p>no Items found</p>
		</div>
	{/if}

	<List items={activeItems} let:item>
		<ListItem itemId={item.id} />
	</List>
	{#if completedItems !== undefined && (showCompleted || activeItems.length === 0)}
		<div class="h-4" />
		<h2 class="text-2xl font-semibold">Completed Items</h2>
		<List items={completedItems} let:item>
			<ListItem itemId={item.id} />
		</List>
	{/if}
	{#if (completedItems === undefined || completedItems.length === 0) && (activeItems === undefined || activeItems.length === 0)}
		<p>no Items found</p>
		<button on:click={() => appStore.dispatch({ type: 'create_list', name: 'New List' })} />
	{/if}
</FadeIn>
<ActionBar>
	<div class="w-full h-full flex items-center justify-between px-4 sm:px-16">
		<!-- occupy left spot, move btton to right side -->
		<div />
		<ActionBarButton
			onClick={() => {
				goto(`/createItem`);
			}}><Plus /> Create Item</ActionBarButton
		>
	</div>
</ActionBar>
