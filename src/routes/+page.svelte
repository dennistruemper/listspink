<script lang="ts">
	import { goto } from '$app/navigation';
	import ActionBar from '../components/actionBar.svelte';
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
	$: items = $appStore.current.currentList?.items;
</script>

{#if items !== undefined}
	<List {items} let:item>
		<ListItem {item} />
	</List>
{:else}
	<p>no Lists found</p>
	<button on:click={() => appStore.dispatch({ type: 'create_list', name: 'New List' })} />
{/if}
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
