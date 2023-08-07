<script lang="ts">
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import FadeIn from '../../components/animation/fadeIn.svelte';
	import Version from '../../components/version.svelte';
	import { appStore } from '../../stores/appStore';
</script>

<FadeIn>
	<p>Debug mode:</p>
	<input type="checkbox" checked={$appStore.debugMode} on:change={appStore.toggleDebugMode} />

	{#if $appStore.debugMode === true}
		<br /><button on:click={appStore.reset}>Reset State</button>
		<br /><br />
		<p></p>
	{/if}
	<br />
	<br />
	<p>
		{#if PUBLIC_BACKEND_URL}
			PUBLIC_BACKEND_URL
		{:else}
			no backend url configured
		{/if}
	</p>

	<Version></Version>
</FadeIn>
