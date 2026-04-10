<script lang="ts">
	import Link from '$components/core/Link.svelte';
	import colors from '$constants/colors';
	import Icon from '@iconify/svelte';
	import * as m from '$lib/paraglide/messages.js';
</script>

<div class="flex h-dvh w-full flex-col items-center justify-center gap-2 text-center">
	<h1>{m.common_under_construction()}</h1>
	<p>{m.common_under_construction_desc()}</p>
	<Icon icon="fluent-emoji-flat:construction" font-size="64" class="mb-2 h-16 w-16 text-r-blue-default" />
	<Link
		label={m.common_go_home()}
		button
		primary
		href="/"
		roundness="large"
		size="large"
		--color="var(--black)"
		--bg-color="var(--gold)"
		--hover-color="var(--white)"
		--hover-bg-color="var(--gold2)"
	>
		{m.common_go_home()}
	</Link>
</div>
