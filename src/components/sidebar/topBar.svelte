<script lang="ts">
	import { sidebarStore } from '../../stores/sidebarStore';
	import { titleStore } from '../../stores/titleStore';
	import Bell from '../../svg/bell.svelte';
	import BurgerMenu from '../../svg/burgerMenu.svelte';
	import Gear from '../../svg/gear.svelte';
	import { textColor } from '../../theme';
	import Separator from '../separator.svelte';
</script>

<button type="button" class="-m-2.5 p-2.5 lg:hidden" on:click={sidebarStore.toggle}>
	<span class="sr-only">Open sidebar</span>
	<BurgerMenu />
</button>

<Separator />
<div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-between items-center">
	<div class="" />
	<a class="text-2xl {textColor}  flex items-center gap-x-1 px-8" href="/listChooser">
		{#if $titleStore.listChooseMode}
			{$titleStore.title}
			<div class="">
				<BurgerMenu />
			</div>
		{:else}
			{$titleStore.title}
		{/if}
	</a>
	<div class="flex items-center gap-x-4 lg:gap-x-6">
		<button type="button" class="-m-2.5 p-2.5">
			<span class="sr-only">View notifications</span>
			<Bell />
		</button>

		<!-- Separator -->
		<Separator />

		<!-- Profile -->
		<div class="relative">
			<button
				type="button"
				class="-m-1.5 flex items-center p-1 hover:animate-spin"
				id="user-menu-button"
				aria-expanded="false"
				aria-haspopup="true"
			>
				<span class="sr-only">Open user menu</span>
				<Gear />
			</button>
		</div>
	</div>
</div>
