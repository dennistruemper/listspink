<script>
	import { sidebarStore } from '../../stores/sidebarStore';
	import Gear from '../../svg/gear.svelte';
	import House from '../../svg/house.svelte';
	import { itemBackground, itemHoverBackground, textColor } from '../../theme';
	import SidebarItem from './sidebarItem.svelte';
</script>

<div class="flex grow flex-col gap-y-5 overflow-y-auto {itemBackground} px-6 pb-4">
	<div class="flex h-4 shrink-0 items-center">
		<!-- Logo? <House /> -->
	</div>
	<nav class="flex flex-1 flex-col">
		<ul role="list" class="flex flex-1 flex-col gap-y-7">
			<li>
				<ul role="list" class="-mx-2 space-y-1">
					<SidebarItem name="Dashboard"><House /></SidebarItem>
				</ul>
			</li>

			<li class="mt-auto">
				<a
					href="/settings"
					class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 {textColor}  {itemHoverBackground}"
					on:click={sidebarStore.toggle}
				>
					<Gear />
					Settings
				</a>
			</li>
		</ul>
	</nav>
</div>
