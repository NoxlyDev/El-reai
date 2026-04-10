<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages.js';

	let { form }: { form: ActionData } = $props();

	let loading = $state(false);

	const redirectTo = $derived($page.url.searchParams.get('redirectTo') || '/profile');
</script>

<svelte:head>
	<title>{m.login_page_title()}</title>
</svelte:head>

<div class="flex min-h-[80vh] items-center justify-center px-4 py-16">
	<div class="w-full max-w-md">
		<div class="mb-8 text-center">
			<h1 class="text-3xl font-bold text-white">{m.login_title()}</h1>
			<p class="mt-2 text-sm text-gray-400">{m.login_subtitle()}</p>
		</div>

		<div class="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
			{#if form?.error}
				<div class="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
					{form.error}
				</div>
			{/if}

			<form
				method="POST"
				action="?/login"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						loading = false;
						await update();
					};
				}}
			>
				<input type="hidden" name="redirectTo" value={redirectTo} />

				<div class="mb-5">
					<label for="email" class="mb-2 block text-sm font-medium text-gray-300">
						{m.login_email_label()}
					</label>
					<input
						id="email"
						name="email"
						type="email"
						autocomplete="email"
						required
						value={form?.email ?? ''}
						placeholder={m.login_email_placeholder()}
						class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>

				<div class="mb-6">
					<label for="password" class="mb-2 block text-sm font-medium text-gray-300">
						{m.login_password_label()}
					</label>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						placeholder={m.login_password_placeholder()}
						class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{loading ? m.login_loading() : m.login_submit()}
				</button>
			</form>

			<div class="relative my-6">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-white/10"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="bg-transparent px-2 text-gray-500">{m.login_divider()}</span>
				</div>
			</div>

			<form method="POST" action="/auth/signin/google">
				<button
					type="submit"
					class="flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:outline-none"
				>
					<svg class="h-5 w-5" viewBox="0 0 24 24">
						<path
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							fill="#4285F4"
						/>
						<path
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							fill="#34A853"
						/>
						<path
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							fill="#FBBC05"
						/>
						<path
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							fill="#EA4335"
						/>
					</svg>
					{m.login_google()}
				</button>
			</form>

			<p class="mt-6 text-center text-sm text-gray-400">
				{m.login_no_account()}
				<a href="/register" class="font-semibold text-blue-400 hover:text-blue-300">
					{m.login_register_link()}
				</a>
			</p>
		</div>
	</div>
</div>
