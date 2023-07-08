<script lang="ts">
	import List from '../components/list.svelte';
	import ListItem from '../components/listItem.svelte';
	import { appStore } from '../stores/appStore';
	import { titleStore } from '../stores/titleStore';

	$: currentList = $appStore.current.currentList;
	$: currentListName = currentList?.name;
	$: console.log('droch', currentListName);
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
