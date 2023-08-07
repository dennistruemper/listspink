<script lang="ts">
	import { version } from '$app/environment';

	const versionAsInt = parseInt(version);
	const showVersion = isNaN(versionAsInt) ? version : `dev-${new Date(versionAsInt).toISOString()}`;
</script>

Version : {showVersion}
