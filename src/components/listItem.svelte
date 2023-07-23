<script lang="ts">
	import { appStore } from '../stores/appStore';
	import { background, textFadedHoverColor, textHoverColor, textSecondaryColor } from '../theme';

	export let itemId: string;
	$: item = $appStore.current.items.filter((i) => i.id === itemId)[0];
	$: completed = item.completed !== undefined;
</script>

<div class="relative flex items-start min-w-full">
	<div class="min-w-0 flex-1 text-sm leading-6 {completed ? 'line-through' : ''}">
		<label for="done{item.name}" class="font-medium {textHoverColor}">{item.name}</label>
		{#if item.description !== undefined}
			<p id="comments-description" class={textFadedHoverColor}>
				{item.description}
			</p>
		{/if}
	</div>
	{#if item.completed !== undefined}
		<div class="text-xs">
			Done: <br />{new Date(item.completed).toLocaleDateString()}
		</div>
	{/if}
	<div class="ml-3 flex h-full items-center">
		<input
			id="done-{item.name}-{item.id}"
			aria-describedby="done with {item.name}"
			name="done"
			type="checkbox"
			class="h-8 w-8 rounded border-transparent focus:ring-transparent {background} {textSecondaryColor} cursor-pointer"
			checked={completed}
			on:change={() =>
				appStore.dispatch({ type: 'toggle_item_done_event', itemId: item.id, time: new Date() })}
		/>
	</div>
</div>
