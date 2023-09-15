<script lang="ts">
	import { dev } from '$app/environment';
	import { onNavigate } from '$app/navigation';
	import { Toaster } from 'svelte-french-toast';
	import '../app.css';
	import SidebarContent from '../components/sidebar/sidebarContent.svelte';
	import TopBar from '../components/sidebar/topBar.svelte';
	import { sidebarStore } from '../stores/sidebarStore';
	import Cross from '../svg/cross.svelte';
	import { backgroundBlur, itemBackground } from '../theme';

	onNavigate((navigation) => {
		// @ts-ignore
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			// @ts-ignore
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	navigator.serviceWorker.register('/service-worker.js', {
		type: dev ? 'module' : 'classic'
	});
</script>

<div class=" min-h-screen">
	<!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
	<div
		class="relative z-50 {$sidebarStore.visible === true ? 'lg:hidden' : 'hidden'} "
		role="dialog"
		aria-modal="true"
	>
		<!-- blur background -->
		<div class="fixed inset-0 {backgroundBlur}" />

		<div class="fixed inset-0 flex">
			<div class="sidebar relative mr-16 flex w-full max-w-xs flex-1">
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

	<div class="sidebar hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
		<SidebarContent />
	</div>

	<div class="lg:pl-72">
		<div
			class="topBar sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 {itemBackground}"
		>
			<TopBar />
		</div>

		<main class="py-4 lg:py-10 h-full">
			<div class="px-4 sm:px-6 lg:px-8 h-full">
				<slot />
			</div>
		</main>
	</div>
</div>

<Toaster />

<style>
	.topBar {
		view-transition-name: topBar;
	}

	.sidebar {
		view-transition-name: sidebar;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	@keyframes fade-out {
		to {
			opacity: 0;
		}
	}

	@keyframes slide-from-right {
		from {
			transform: translateX(100px);
		}
	}

	@keyframes slide-to-left {
		to {
			transform: translateX(-100px);
		}
	}

	:root::view-transition-old(root) {
		animation:
			180ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
			600ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
	}

	:root::view-transition-new(root) {
		animation:
			420ms cubic-bezier(0, 0, 0.2, 1) 180ms both fade-in,
			600ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
	}
</style>
