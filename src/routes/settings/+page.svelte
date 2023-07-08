<script lang="ts">
	import { appStore } from '../../stores/appStore';
	import { titleStore } from '../../stores/titleStore';
	titleStore.set({ title: 'Settings', listChooseMode: false });
</script>

<p>Debug mode:</p>
<input type="checkbox" checked={$appStore.debugMode} on:change={appStore.toggleDebugMode} />
