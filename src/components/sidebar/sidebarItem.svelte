<script lang="ts">
	import { itemHoverBackground, textHoverColor } from '../../theme';

	export let name: string;
</script>

<li class="group">
	<a
		href="#"
		class="{textHoverColor} {itemHoverBackground}
        group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
	>
		<slot />
		{name}
	</a>
</li>
