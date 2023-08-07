<script>
	import FadeIn from '../../components/animation/fadeIn.svelte';
	import List from '../../components/list.svelte';
	import ListItem from '../../components/listItem.svelte';
	import { appStore } from '../../stores/appStore';
	import { titleStore } from '../../stores/titleStore';

	titleStore.set({ title: 'All Items', listChooseMode: false });

	$: items = $appStore.current.items;
</script>

<FadeIn>
	<List {items} let:item>
		<ListItem itemId={item.id} />
	</List>
</FadeIn>
