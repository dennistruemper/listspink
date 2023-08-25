<script lang="ts">
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import FadeIn from '../../components/animation/fadeIn.svelte';
	import Version from '../../components/version.svelte';
	import { appStore } from '../../stores/appStore';

	appStore.dispatch({ type: 'load_version' });

	$: version = $appStore.current.version;
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

	<p>
		Version: {#if version === undefined}
			Loading version...
		{:else}
			{version}
		{/if}
	</p>

	<Version></Version>
</FadeIn>
