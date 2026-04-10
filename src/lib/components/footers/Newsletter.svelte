<script lang="ts">
	import NewsletterButton from './NewsletterButton.svelte';
	import * as m from '$lib/paraglide/messages.js';
</script>

<div class="newsletter">
	<span>{m.footer_newsletter_label()}</span>
	<h2>{m.footer_newsletter_title()}</h2>
	<p>{m.footer_newsletter_desc()}</p>
	<NewsletterButton />
</div>

<style lang="postcss">
	@reference '$appcss';

	.newsletter {
		@apply flex w-full flex-col items-center justify-center bg-r-midnight-400 px-3 py-12 text-base;
	}

	span {
		@apply font-medium text-(--borderSilver);
	}
	h2 {
		@apply max-w-sm text-center text-3xl;
	}
	p {
		@apply mt-2 max-w-sm text-center text-(--borderSilver);
	}
</style>
