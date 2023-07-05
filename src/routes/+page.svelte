<script lang="ts">
	import List from '../components/list.svelte';
	import ListItem from '../components/listItem.svelte';
	import { titleStore } from '../stores/titleStore';

	titleStore.set('TODO: List Name');
	let items = [
		'dummy',
		'bananen',
		'schokolade',
		'hier etwas text',
		'die küche aufräumen',
		'bei mama anrufen'
	];
</script>

<List {items} let:item>
	<ListItem title={item} description="some cool description" />
</List>
