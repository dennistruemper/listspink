<script lang="ts">
	import { sidebarStore } from '../../stores/sidebarStore';
	import { itemHoverBackground, textHoverColor } from '../../theme';

	export let name: string;
	export let href: string;
</script>

<li class="group">
	<a
		{href}
		class="{textHoverColor} {itemHoverBackground}
        group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
		on:click={sidebarStore.toggle}
	>
		<slot />
		{name}
	</a>
</li>
