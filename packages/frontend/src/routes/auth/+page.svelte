<script lang="ts">
	import ActionBar from '../../components/actionBar.svelte';
	import ActionBarButton from '../../components/buttons/actionBarButton.svelte';
	import { appStore } from '../../stores/appStore';
	import { titleStore } from '../../stores/titleStore';
	import { textColor } from '../../theme';

	titleStore.set({ title: 'Account', listChooseMode: false });
	console.log('user', $appStore.current.user);
</script>

{#if $appStore.current.user}
	<p class={textColor}>
		Logged in as {$appStore.current.user.displayName ?? $appStore.current.user.name}
	</p>
{:else}
	<p class={textColor}>Not logged in</p>
{/if}

<ActionBar>
	<div class="w-full h-full flex items-center justify-between px-4 sm:px-16">
		<div></div>
		{#if $appStore.current.user === undefined}
			<ActionBarButton onClick={() => appStore.dispatch({ type: 'login_initialized' })}
				>Login</ActionBarButton
			>
		{:else}
			<ActionBarButton onClick={() => appStore.dispatch({ type: 'logout' })}>Logout</ActionBarButton
			>
		{/if}
	</div>
</ActionBar>
