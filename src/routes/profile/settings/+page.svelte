<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import * as m from '$lib/paraglide/messages.js';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const session = $derived(data.session);
	const user = $derived(session?.user);

	let loadingProfile = $state(false);
	let loadingEmail = $state(false);
	let loadingPassword = $state(false);
</script>

<svelte:head>
	<title>{m.settings_page_title()}</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-12">
	<div class="mb-8 flex items-center gap-4">
		<a
			href="/profile"
			class="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			{m.settings_back()}
		</a>
	</div>

	<div class="mb-8">
		<h1 class="text-3xl font-bold text-white">{m.settings_title()}</h1>
		<p class="mt-1 text-sm text-gray-400">{m.settings_subtitle()}</p>
	</div>

	<div class="space-y-6">
		<div class="rounded-2xl border border-white/10 bg-white/5 p-6">
			<h2 class="mb-1 text-lg font-semibold text-white">{m.settings_display_name_title()}</h2>
			<p class="mb-5 text-sm text-gray-400">{m.settings_display_name_desc()}</p>

			{#if form?.updateProfile?.success}
				<div class="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
					{m.settings_name_success()}
				</div>
			{/if}
			{#if form?.updateProfile?.error}
				<div class="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
					{form.updateProfile.error}
				</div>
			{/if}

			<form
				method="POST"
				action="?/updateProfile"
				use:enhance={() => {
					loadingProfile = true;
					return async ({ update }) => {
						loadingProfile = false;
						await update();
					};
				}}
				class="flex flex-col gap-4 sm:flex-row sm:items-end"
			>
				<div class="flex-1">
					<label for="name" class="mb-2 block text-sm font-medium text-gray-300">
						{m.settings_name_label()}
					</label>
					<input
						id="name"
						name="name"
						type="text"
						autocomplete="name"
						required
						minlength="2"
						maxlength="50"
						value={user?.name ?? ''}
						placeholder={m.settings_name_placeholder()}
						class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>
				<button
					type="submit"
					disabled={loadingProfile}
					class="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{loadingProfile ? m.settings_saving() : m.settings_save()}
				</button>
			</form>
		</div>

		<div class="rounded-2xl border border-white/10 bg-white/5 p-6">
			<h2 class="mb-1 text-lg font-semibold text-white">{m.settings_email_title()}</h2>
			<p class="mb-5 text-sm text-gray-400">
				{m.settings_current_email()} <span class="font-medium text-gray-200">{user?.email}</span>
			</p>

			{#if form?.updateEmail?.success}
				<div class="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
					{m.settings_email_success()}
				</div>
			{/if}
			{#if form?.updateEmail?.error}
				<div class="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
					{form.updateEmail.error}
				</div>
			{/if}

			<form
				method="POST"
				action="?/updateEmail"
				use:enhance={() => {
					loadingEmail = true;
					return async ({ update }) => {
						loadingEmail = false;
						await update();
					};
				}}
				class="flex flex-col gap-4 sm:flex-row sm:items-end"
			>
				<div class="flex-1">
					<label for="email" class="mb-2 block text-sm font-medium text-gray-300">
						{m.settings_new_email_label()}
					</label>
					<input
						id="email"
						name="email"
						type="email"
						autocomplete="email"
						required
						placeholder={m.settings_new_email_placeholder()}
						class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>
				<button
					type="submit"
					disabled={loadingEmail}
					class="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{loadingEmail ? m.settings_saving() : m.settings_update_email()}
				</button>
			</form>
		</div>

		<div class="rounded-2xl border border-white/10 bg-white/5 p-6">
			<h2 class="mb-1 text-lg font-semibold text-white">{m.settings_password_title()}</h2>
			<p class="mb-5 text-sm text-gray-400">{m.settings_password_desc()}</p>

			{#if form?.changePassword?.success}
				<div class="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
					{m.settings_password_success()}
				</div>
			{/if}
			{#if form?.changePassword?.error}
				<div class="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
					{form.changePassword.error}
				</div>
			{/if}

			<form
				method="POST"
				action="?/changePassword"
				use:enhance={() => {
					loadingPassword = true;
					return async ({ update }) => {
						loadingPassword = false;
						await update();
					};
				}}
				class="space-y-4"
			>
				<div>
					<label for="currentPassword" class="mb-2 block text-sm font-medium text-gray-300">
						{m.settings_current_password()}
					</label>
					<input
						id="currentPassword"
						name="currentPassword"
						type="password"
						autocomplete="current-password"
						required
						placeholder="••••••••"
						class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>
				<div>
					<label for="newPassword" class="mb-2 block text-sm font-medium text-gray-300">
						{m.settings_new_password()}
					</label>
					<input
						id="newPassword"
						name="newPassword"
						type="password"
						autocomplete="new-password"
						required
						minlength="8"
						placeholder={m.settings_new_password_hint()}
						class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>
				<div>
					<label for="confirmPassword" class="mb-2 block text-sm font-medium text-gray-300">
						{m.settings_confirm_password()}
					</label>
					<input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						autocomplete="new-password"
						required
						minlength="8"
						placeholder={m.settings_confirm_placeholder()}
						class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>
				<div class="pt-2">
					<button
						type="submit"
						disabled={loadingPassword}
						class="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{loadingPassword ? m.settings_changing() : m.settings_change_password_btn()}
					</button>
				</div>
			</form>
		</div>

		<div class="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
			<h2 class="mb-1 text-lg font-semibold text-white">{m.settings_danger_title()}</h2>
			<p class="mb-5 text-sm text-gray-400">{m.settings_danger_desc()}</p>
			<a
				href="/logout"
				class="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
			>
				{m.settings_signout()}
			</a>
		</div>
	</div>
</div>
