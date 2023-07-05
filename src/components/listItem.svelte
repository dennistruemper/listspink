<script lang="ts">
	export let description: string | undefined = undefined;
	export let title: string;
</script>

<div class="relative flex items-start min-w-full">
	<div class="min-w-0 flex-1 text-sm leading-6">
		<label for="comments" class="font-medium text-gray-900">{title}</label>
		{#if description !== undefined}
			<p id="comments-description" class="text-gray-500">
				{description}
			</p>
		{/if}
	</div>
	<div class="ml-3 flex h-full items-center">
		<input
			id="comments"
			aria-describedby="comments-description"
			name="comments"
			type="checkbox"
			class="h-8 w-8 rounded border-gray-300 bg-pink-100 dark:bg-purple-900 text-purple-900 dark:text-pink-500 cursor-pointer"
		/>
	</div>
</div>
