<script lang="ts">
	import FadeIn from '../../components/animation/fadeIn.svelte';
	import { appStore } from '../../stores/appStore';
	import { titleStore } from '../../stores/titleStore';
	titleStore.set({ title: 'Settings', listChooseMode: false });
</script>

<FadeIn>
	<p>Debug mode:</p>
	<input type="checkbox" checked={$appStore.debugMode} on:change={appStore.toggleDebugMode} />

	{#if $appStore.debugMode === true}
		<br /><button on:click={appStore.reset}>Reset State</button>
	{/if}
</FadeIn>
