<script lang="ts">
	import toast from 'svelte-french-toast';
	import ActionBar from '../../components/actionBar.svelte';
	import ActionBarBackButton from '../../components/buttons/actionBarBackButton.svelte';
	import ActionBarButton from '../../components/buttons/actionBarButton.svelte';
	import MultilineTextInput from '../../components/form/multilineTextInput.svelte';
	import TextInput from '../../components/form/textInput.svelte';
	import { appStore } from '../../stores/appStore';
	import { titleStore } from '../../stores/titleStore';
	import { itemBackground, textColor } from '../../theme';

	$: titleStore.set({ title: 'Create Item', listChooseMode: false });

	var itemName: string | undefined = undefined;
	$: description = undefined;
	$: currentList = $appStore.current.currentList?.id;
	$: lists = $appStore.current.lists;
	$: selectedLists = currentList === undefined ? [] : [currentList];

	function validateForm(name: string | undefined): boolean {
		if (name !== undefined && name?.length > 0) {
			return true;
		}
		return false;
	}

	function toggleListSelected(listId: string, selectedLists: string[]): string[] {
		if (selectedLists.includes(listId)) {
			return selectedLists.filter((lisId) => lisId !== listId);
		} else return [...selectedLists, listId];
	}
</script>

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
		<h3 class="">List to add item</h3>
		<div class=" space-y-3 rounded-xl p-4 ml-8 {itemBackground}">
			{#each lists as list}
				<div class="flex flex-row items-center justify-center">
					<div class="flex flex-column items-center w-full px-8 sm:px-14 sm:w-5/666">
						<input
							type="checkbox"
							id={list.id}
							checked={selectedLists.indexOf(list.id) !== -1}
							on:click={() => {
								selectedLists = toggleListSelected(list.id, selectedLists);
							}}
						/>
						<div class="pl-2">{list.name}</div>
						<br />
					</div>
				</div>
			{/each}
		</div>
	</div>
</form>

<ActionBar>
	<div class="w-full h-full flex items-center justify-between px-16">
		<ActionBarBackButton />
		<ActionBarButton
			onClick={() => {
				if (validateForm(itemName)) {
					const listIds = selectedLists;
					appStore.dispatch({
						type: 'create_item_and_add_to_lists',
						listIds: listIds,
						name: itemName ?? '',
						description: description
					});
					toast.success(`Item created: ${itemName}`, {
						position: 'bottom-center'
					});
					itemName = undefined;
					description = undefined;
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
