<script lang="ts">
	import { background, textFadedHoverColor, textHoverColor, textSecondaryColor } from '../theme';

	export let description: string | undefined = undefined;
	export let title: string;
</script>

<div class="relative flex items-start min-w-full">
	<div class="min-w-0 flex-1 text-sm leading-6">
		<label for="done{title}" class="font-medium {textHoverColor}">{title}</label>
		{#if description !== undefined}
			<p id="comments-description" class={textFadedHoverColor}>
				{description}
			</p>
		{/if}
	</div>
	<div class="ml-3 flex h-full items-center">
		<input
			id="done{title}"
			aria-describedby="done with {title}"
			name="done"
			type="checkbox"
			class="h-8 w-8 rounded border-transparent focus:ring-transparent {background} {textSecondaryColor} cursor-pointer"
		/>
	</div>
</div>
