<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { base } from '$app/paths';
	import toast from 'svelte-french-toast';
	import ActionBar from '../../../../components/actionBar.svelte';
	import FadeIn from '../../../../components/animation/fadeIn.svelte';
	import ActionBarBackButton from '../../../../components/buttons/actionBarBackButton.svelte';
	import ActionBarButton from '../../../../components/buttons/actionBarButton.svelte';
	import MultilineTextInput from '../../../../components/form/multilineTextInput.svelte';
	import TextInput from '../../../../components/form/textInput.svelte';
	import { appStore } from '../../../../stores/appStore';
	import { titleStore } from '../../../../stores/titleStore';
	import { textColor } from '../../../../theme';
	import { Routes } from '../../../routes';

	let previousPage: string = base;

	afterNavigate((input) => {
		previousPage = input.from?.url.pathname ?? base;
	});
	export let data;

	const isInvalidItem =
		data.itemId === undefined ||
		!$appStore.current.items.map((item) => item.id).includes(data.itemId ?? '');

	if (isInvalidItem) {
		toast.error(`Item not found`, {
			position: 'bottom-center'
		});
		goto(Routes.items);
	}

	titleStore.set({ title: 'Edit Item', listChooseMode: false });

	let itemRaw = $appStore.current.items.find((item) => item.id === data.itemId);
	let itemName = itemRaw?.name;
	let description = itemRaw?.description;

	function validateForm(name: string | undefined): boolean {
		if (name !== undefined && name?.length > 0) {
			return true;
		}
		return false;
	}
</script>

<FadeIn>
	<form>
		<div class="space-y-4 sm:space-y-8 {textColor}">
			<TextInput
				placeholder="Name of your new item"
				caption="Name"
				name="name"
				bind:value={itemName}
			/>
			<MultilineTextInput
				bind:value={description}
				name="description"
				rows={3}
				caption="Description"
			/>
		</div>
	</form>
</FadeIn>

<ActionBar>
	<div class="w-full h-full flex items-center justify-between px-16">
		<ActionBarBackButton />
		<ActionBarButton
			onClick={() => {
				if (validateForm(itemName)) {
					appStore.dispatch({
						type: 'edit_item',
						itemId: data.itemId ?? '',
						name: itemName ?? '',
						description: description
					});
					toast.success(`Item updated: ${itemName}`, {
						position: 'bottom-center'
					});
					itemName = undefined;
					description = undefined;
					goto(previousPage);
				} else {
					toast.error(`Please enter a name`, {
						position: 'bottom-center'
					});
				}
			}}
		>
			Save
		</ActionBarButton>
	</div>
</ActionBar>
