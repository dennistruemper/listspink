<script lang="ts">
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import FadeIn from '../../components/animation/fadeIn.svelte';
	import Version from '../../components/version.svelte';
	import { appStore } from '../../stores/appStore';

	// fetch data from google.de
	const version: Promise<Response> = fetch(PUBLIC_BACKEND_URL + '/api/version');
</script>

<FadeIn>
	<p>Debug mode:</p>
	<input type="checkbox" checked={$appStore.debugMode} on:change={appStore.toggleDebugMode} />

	{#if $appStore.debugMode === true}
		<br /><button on:click={appStore.reset}>Reset State</button>
		<br /><br />
		<p></p>
		<br />
		<br />
		<p>
			{#if PUBLIC_BACKEND_URL}
				{PUBLIC_BACKEND_URL}
			{:else}
				no backend url configured
			{/if}
		</p>
	{/if}

	{#await version}
		<p>loading backendversion...</p>
	{:then response}
		<p>Version: {JSON.stringify(response)}</p>
	{:catch error}
		<p>error: {error.message}</p>
	{/await}

	<Version></Version>
</FadeIn>
