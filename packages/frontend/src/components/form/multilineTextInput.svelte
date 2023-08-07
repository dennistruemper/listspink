<script lang="ts">
	import { UuidGenerator } from '../../adapter/uuid';
	import { background } from '../../theme';
	import FormBase from './formBase.svelte';
	export let id: string = UuidGenerator.v4();
	export let name: string;
	export let rows = 3;
	export let caption: string;
	export let value: string | undefined;
</script>

<FormBase>
	<div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
		<label for={id} class="block text-sm font-medium leading-6 sm:pt-1.5">{caption}</label>
		<div class="mt-2 sm:col-span-2 sm:mt-0">
			<textarea
				contenteditable="true"
				{id}
				{name}
				{rows}
				class="block w-full max-w-2xl rounded-md border-1.5 py-1.5 shadow-lg ring-inset sm:text-sm sm:leading-6 {background}"
				bind:value
			/>
		</div>
	</div>
</FormBase>
