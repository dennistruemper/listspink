<script lang="ts">
	import { UuidGenerator } from '../../adapter/uuid';
	import { placeholderTextColor } from '../../theme';

	interface TetxInputOptions {
		isUsername?: boolean;
	}

	import FormBase from './formBase.svelte';
	export let caption: string;
	export let placeholder: string;
	export let options: TetxInputOptions = {};
	export let name: string;
	export let id: string = UuidGenerator.v4();
	export let value: string | undefined = undefined;
</script>

<FormBase>
	<div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
		<label for="username" class="block text-sm font-medium leading-6 sm:pt-1.5">{caption}</label>
		<div class="mt-2 sm:col-span-2 sm:mt-0">
			<div class="flex rounded-md shadow-sm ring-1 ring-inset sm:max-w-md">
				<input
					type="text"
					{name}
					{id}
					autocomplete={options.isUsername ? 'username' : undefined}
					class=" block flex-1 bg-transparent focus: py-1.5 pl-2 sm:text-sm sm:leading-6 {placeholderTextColor}"
					{placeholder}
					bind:value
				/>
			</div>
		</div>
	</div>
</FormBase>
