<script lang="ts">
	import { goto } from '$app/navigation';
	import { Routes } from '../../routes/routes';
	import { appStore } from '../../stores/appStore';
	import { sidebarStore } from '../../stores/sidebarStore';
	import { titleStore } from '../../stores/titleStore';
	import BurgerMenu from '../../svg/burgerMenu.svelte';
	import Gear from '../../svg/gear.svelte';
	import { textColor } from '../../theme';
	import Separator from '../separator.svelte';
	$: listId = $appStore.current.currentList?.id;
	$: isAuthenticated = $appStore.current.user !== undefined;
</script>

<button type="button" class="-m-2.5 p-2.5 lg:hidden" on:click={sidebarStore.toggle}>
	<span class="sr-only">Open sidebar</span>
	<div class={isAuthenticated ? '' : 'text-red-500'}>
		<BurgerMenu />
	</div>
</button>

<Separator />
<div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-between items-center">
	<div class="" />
	<div class="text-xs sm:text-2xl {textColor} text-lg flex items-center gap-x-1 px-8">
		{#if $titleStore.listChooseMode}
			<a href={Routes.listChooser} class="flex items-center gap-x-2">
				{$titleStore.title}
				<div class="">
					<BurgerMenu />
				</div>
			</a>
		{:else}
			<h1>{$titleStore.title}</h1>
		{/if}
	</div>
	<div class="flex items-center gap-x-4 lg:gap-x-6">
		{#if $titleStore.listChooseMode}
			<Separator />
			<div class="relative">
				<button
					disabled={listId === undefined}
					type="button"
					class="-m-1.5 flex items-center p-1 hover:animate-spin"
					id="user-menu-button"
					aria-expanded="false"
					aria-haspopup="true"
					on:click={() => {
						if (listId !== undefined) {
							goto(Routes.editList({ listId: listId }));
						}
					}}
				>
					<span class="sr-only">Open user menu</span>
					<Gear />
				</button>
			</div>
		{/if}
	</div>
</div>
