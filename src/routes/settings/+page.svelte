<script lang="ts">
	import { appStore } from '../../stores/appStore';
	$: checked = 'checked'; //$appStore.debugMode;
</script>

<p>Debug mode:</p>
<input type="checkbox" checked={$appStore.debugMode} on:change={appStore.toggleDebugMode} />
