<script>
	import Calendar from '../../svg/calendar.svelte';
	import Documents from '../../svg/documents.svelte';
	import Folder from '../../svg/folder.svelte';
	import Gear from '../../svg/gear.svelte';
	import House from '../../svg/house.svelte';
	import People from '../../svg/people.svelte';
	import PieDiagram from '../../svg/pieDiagram.svelte';
	import SidebarItem from './sidebarItem.svelte';
</script>

<div
	class="flex grow flex-col gap-y-5 overflow-y-auto bg-primary-500 dark:bg-primaryDark-700 px-6 pb-4"
>
	<div class="flex h-16 shrink-0 items-center">
		<House />
	</div>
	<nav class="flex flex-1 flex-col">
		<ul role="list" class="flex flex-1 flex-col gap-y-7">
			<li>
				<ul role="list" class="-mx-2 space-y-1">
					<SidebarItem name="Dashboard"><House /></SidebarItem>
					<SidebarItem name="Team"><People /></SidebarItem>
					<SidebarItem name="Projects"><Folder /></SidebarItem>
					<SidebarItem name="Calendar"><Calendar /></SidebarItem>
					<SidebarItem name="Documents"><Documents /></SidebarItem>
					<SidebarItem name="Reports"><PieDiagram /></SidebarItem>
				</ul>
			</li>

			<li class="mt-auto">
				<a
					href="#"
					class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 hover:text-gray-200 hover:bg-primary-800 dark:hover:bg-secondary-900"
				>
					<Gear />
					Settings
				</a>
			</li>
		</ul>
	</nav>
</div>
