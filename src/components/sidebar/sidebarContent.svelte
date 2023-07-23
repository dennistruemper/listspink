<script>
	import {} from '$app/paths';
	import { Routes } from '../../routes/routes';
	import { sidebarStore } from '../../stores/sidebarStore';
	import BurgerMenu from '../../svg/burgerMenu.svelte';
	import Gear from '../../svg/gear.svelte';
	import House from '../../svg/house.svelte';
	import { itemBackground, itemHoverBackground, textColor } from '../../theme';
	import SidebarItem from './sidebarItem.svelte';
</script>

<div
	class="flex grow flex-col gap-y-5 overflow-y-auto {itemBackground} px-6 pb-4 rounded-r-3xl sm:rounded-none"
>
	<div class="flex h-4 shrink-0 items-center">
		<!-- Logo? <House /> -->
	</div>
	<nav class="flex flex-1 flex-col">
		<ul role="list" class="flex flex-1 flex-col gap-y-7">
			<li>
				<SidebarItem name="Home" href={Routes.home}><House /></SidebarItem>
				<SidebarItem name="Lists" href={Routes.listChooser}><BurgerMenu /></SidebarItem>
				<SidebarItem name="Items" href={Routes.items}><BurgerMenu /></SidebarItem>
			</li>

			<li class="mt-auto">
				<a
					href="/settings"
					class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 {textColor}  {itemHoverBackground}"
					on:click={sidebarStore.toggle}
				>
					<Gear />
					App Settings
				</a>
			</li>
		</ul>
	</nav>
</div>
