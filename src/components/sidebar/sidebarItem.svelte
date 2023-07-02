<script lang="ts">
	export let name: string;
</script>

<li>
	<a
		href="#"
		class="text-gray-800 hover:text-gray-200 hover:bg-primary-800
        group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
	>
		<slot />
		{name}
	</a>
</li>
