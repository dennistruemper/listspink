<script lang="ts">
	import type { Item } from '../domain/definitions/item';
	import { background, textFadedHoverColor, textHoverColor, textSecondaryColor } from '../theme';

	export let item: Item;
</script>

<div class="relative flex items-start min-w-full">
	<div class="min-w-0 flex-1 text-sm leading-6">
		<label for="done{item.name}" class="font-medium {textHoverColor}">{item.name}</label>
		{#if item.description !== undefined}
			<p id="comments-description" class={textFadedHoverColor}>
				{item.description}
			</p>
		{/if}
	</div>
	<div class="ml-3 flex h-full items-center">
		<input
			id="done{item.name}"
			aria-describedby="done with {item.name}"
			name="done"
			type="checkbox"
			class="h-8 w-8 rounded border-transparent focus:ring-transparent {background} {textSecondaryColor} cursor-pointer"
		/>
	</div>
</div>
