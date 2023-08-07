<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { base } from '$app/paths';
	import ActionBarButton from './actionBarButton.svelte';

	let previousPage: string = base;

	afterNavigate((input) => {
		previousPage = input.from?.url?.pathname ?? base;
	});
</script>

<ActionBarButton
	onClick={() => {
		goto(previousPage);
	}}>Back</ActionBarButton
>
