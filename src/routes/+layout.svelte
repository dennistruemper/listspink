<script lang="ts">
	import '../app.css';
	import SidebarContent from '../components/sidebar/sidebarContent.svelte';
	import TopBar from '../components/sidebar/topBar.svelte';
	import { sidebarStore } from '../stores/sidebarStore';
	import Cross from '../svg/cross.svelte';
</script>

<div class="bg-primary-100 min-h-screen">
	<!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
	<div
		class="relative z-50 {$sidebarStore.visible === true ? 'lg:hidden' : 'hidden'}"
		role="dialog"
		aria-modal="true"
	>
		<div class="fixed inset-0 bg-gray-900/80" />

		<div class="fixed inset-0 flex">
			<div class="relative mr-16 flex w-full max-w-xs flex-1">
				<div
					class="absolute left-full top-0 flex w-16 justify-center pt-5
					{$sidebarStore.visible === true ? '' : 'hidden'}"
				>
					<button type="button" class="-m-2.5 p-2.5" on:click={sidebarStore.toggle}>
						<span class="sr-only">Close sidebar</span>
						<Cross />
					</button>
				</div>

				<SidebarContent />
			</div>
		</div>
	</div>

	<div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
		<SidebarContent />
	</div>

	<div class="lg:pl-72">
		<div
			class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8"
		>
			<TopBar />
		</div>

		<main class="py-4 lg:py-10 h-full">
			<div class="px-4 sm:px-6 lg:px-8">
				<slot />
			</div>
		</main>
	</div>
</div>
