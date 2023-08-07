<script lang="ts">
	import { goto } from '$app/navigation';
	import toast from 'svelte-french-toast';
	import ActionBar from '../../../../components/actionBar.svelte';
	import FadeIn from '../../../../components/animation/fadeIn.svelte';
	import ActionBarBackButton from '../../../../components/buttons/actionBarBackButton.svelte';
	import ActionBarButton from '../../../../components/buttons/actionBarButton.svelte';
	import TextInput from '../../../../components/form/textInput.svelte';
	import { appStore } from '../../../../stores/appStore';
	import { titleStore } from '../../../../stores/titleStore';
	import { textColor } from '../../../../theme';
	import { Routes } from '../../../routes';

	export let data;

	const isInvalidList =
		data.listId === undefined ||
		!$appStore.current.lists.map((item) => item.id).includes(data.listId ?? '');

	if (isInvalidList) {
		toast.error(`List not found`, {
			position: 'bottom-center'
		});
		goto(Routes.listChooser);
	}

	titleStore.set({ title: 'Edit List', listChooseMode: false });

	let listRaw = $appStore.current.lists.find((list) => list.id === data.listId);
	let listName = listRaw?.name;

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
				placeholder="Name of your new list"
				caption="Name"
				name="name"
				bind:value={listName}
			/>
		</div>
	</form>
</FadeIn>
<ActionBar>
	<div class="w-full h-full flex items-center justify-between px-16">
		<ActionBarBackButton />
		<ActionBarButton
			onClick={() => {
				if (validateForm(listName)) {
					appStore.dispatch({
						type: 'edit_list',
						listId: data.listId ?? '',
						name: listName
					});
					toast.success(`List updated: ${listName}`, {
						position: 'bottom-center'
					});
				} else {
					toast.error('Enter a name', { position: 'bottom-center' });
				}
			}}
		>
			Save
		</ActionBarButton>
	</div>
</ActionBar>
