<script lang="ts">
	import { itemHoverBackground, textHoverColor } from '../../theme';

	export let onClick: () => void;
</script>

<div class="group">
	<button
		type="button"
		class="inline-flex items-center gap-x-1.5 rounded-md {itemHoverBackground} px-2.5 py-1.5 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 {textHoverColor} "
		on:click={onClick}
	>
		<slot />
	</button>
</div>
