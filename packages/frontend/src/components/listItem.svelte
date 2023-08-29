<script lang="ts">
	import { goto } from '$app/navigation';
	import { Routes } from '../routes/routes';
	import { appStore } from '../stores/appStore';
	import {
		background,
		itemHoveredBackground,
		textFadedHoverColor,
		textHoverColor,
		textHoveredColr,
		textSecondaryColor
	} from '../theme';

	export let itemId: string;
	$: item = $appStore.current.items.filter((i) => i.id === itemId)[0];
	$: completed = item?.completed !== undefined;
</script>

{#if item === undefined}
	<!-- loading spinner with tailwind -->
	<div class="flex justify-center items-center">
		<div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
	</div>
{:else}
	<div class="relative flex items-start min-w-full">
		<button
			class="p-2 mr-3 rounded-lg {itemHoveredBackground + textHoveredColr}"
			on:click={() => {
				goto(Routes.editItem({ itemId: item.id }));
			}}>Edit</button
		>
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
					appStore.dispatch({
						type: 'toggle_item_done_event',
						newDoneState: !completed,
						itemId: item.id,
						time: new Date()
					})}
			/>
		</div>
	</div>
{/if}
