<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { base } from '$app/paths';
	import toast from 'svelte-french-toast';
	import ActionBar from '../../../components/actionBar.svelte';
	import FadeIn from '../../../components/animation/fadeIn.svelte';
	import ActionBarBackButton from '../../../components/buttons/actionBarBackButton.svelte';
	import ActionBarButton from '../../../components/buttons/actionBarButton.svelte';
	import TextInput from '../../../components/form/textInput.svelte';
	import { appStore } from '../../../stores/appStore';
	import { titleStore } from '../../../stores/titleStore';
	import { textColor } from '../../../theme';

	titleStore.set({ title: 'Create List', listChooseMode: false });
	var listName: string | undefined = undefined;

	function validateForm(name: string | undefined): boolean {
		if (name !== undefined && name?.length > 0) {
			return true;
		}
		return false;
	}

	let previousPage: string = base;

	afterNavigate(({ from }) => {
		previousPage = from?.url.pathname || previousPage;
	});
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
						type: 'create_list',
						name: listName ?? ''
					});
					toast.success(`List created: ${listName}`, {
						position: 'bottom-center'
					});
					listName = undefined;
				} else {
					toast.error('Enter a name', { position: 'bottom-center' });
				}
			}}
		>
			Save
		</ActionBarButton>
	</div>
</ActionBar>
