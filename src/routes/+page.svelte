<script lang="ts">
	import List from '../components/list.svelte';
	import ListItem from '../components/listItem.svelte';
	import type { Item } from '../domain/definitions/item';
	import { titleStore } from '../stores/titleStore';

	titleStore.set('TODO: List Name');
	let items: Item[] = [
		{ name: 'dummy', description: 'some description' },
		{ name: 'bananen' },
		{ name: 'schokolade' },
		{ name: 'hier etwas text', completed: '2023-07-01T10:03:01Z' },
		{ name: 'die küche aufräumen', description: 'Abwasch tut mal wieder not' },
		{ name: 'bei mama anrufen' }
	];
</script>

<List {items} let:item>
	<ListItem {item} />
</List>
