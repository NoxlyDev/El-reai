<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const session = $derived(data.session);
	const user = $derived(session?.user);

	function formatCustomId(id: string): string {
		if (!id) return 'N/A';
		if (id.length === 8) return `${id.slice(0, 4)}-${id.slice(4)}`;
		if (id.length === 9) return `${id.slice(0, 3)}-${id.slice(3, 6)}-${id.slice(6)}`;
		return `${id.slice(0, 3)}-${id.slice(3, 7)}-${id.slice(7)}`;
	}
</script>

<svelte:head>
	<title>Profil - Playreia</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-12">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-white">Profil Saya</h1>
		<p class="mt-1 text-sm text-gray-400">Informasi akun dan identitas unikmu di Playreia</p>
	</div>

	<div class="grid gap-6 lg:grid-cols-3">
		<div class="lg:col-span-1">
			<div class="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
				{#if user?.image}
					<img
						src={user.image}
						alt={user.name ?? 'Avatar'}
						class="mx-auto h-24 w-24 rounded-full ring-2 ring-blue-500/50"
					/>
				{:else}
					<div class="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-3xl font-bold text-white">
						{(user?.name ?? user?.email ?? 'U').charAt(0).toUpperCase()}
					</div>
				{/if}

				<h2 class="mt-4 text-xl font-semibold text-white">
					{user?.name ?? 'Pengguna'}
				</h2>
				<p class="mt-1 text-sm text-gray-400">{user?.email}</p>

				<div class="mt-4 flex justify-center">
					<span class="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400 ring-1 ring-green-500/30">
						<span class="h-1.5 w-1.5 rounded-full bg-green-400"></span>
						Aktif
					</span>
				</div>

				<div class="mt-6">
					<a
						href="/logout"
						class="block w-full rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
					>
						Keluar
					</a>
				</div>
			</div>
		</div>

		<div class="lg:col-span-2 space-y-6">
			<div class="rounded-2xl border border-white/10 bg-white/5 p-6">
				<h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
					ID Unik Playreia
				</h3>

				<div class="rounded-xl border border-blue-500/30 bg-blue-500/10 p-5">
					<p class="mb-1 text-xs text-blue-400">Custom ID Permanenmu</p>
					<div class="flex items-center gap-3">
						<span class="font-mono text-3xl font-bold tracking-widest text-white">
							{formatCustomId(user?.custom_id ?? '')}
						</span>
					</div>
					<p class="mt-2 text-xs text-gray-500">
						ID ini unik, permanen, dan hanya dimiliki olehmu di Playreia.
						{#if user?.custom_id}
							({user.custom_id.length} digit)
						{/if}
					</p>
				</div>
			</div>

			<div class="rounded-2xl border border-white/10 bg-white/5 p-6">
				<h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
					Informasi Akun
				</h3>

				<dl class="space-y-4">
					<div class="flex items-center justify-between border-b border-white/5 pb-4">
						<dt class="text-sm text-gray-400">Nama</dt>
						<dd class="text-sm font-medium text-white">{user?.name ?? '—'}</dd>
					</div>
					<div class="flex items-center justify-between border-b border-white/5 pb-4">
						<dt class="text-sm text-gray-400">Email</dt>
						<dd class="text-sm font-medium text-white">{user?.email}</dd>
					</div>
					<div class="flex items-center justify-between border-b border-white/5 pb-4">
						<dt class="text-sm text-gray-400">ID Internal</dt>
						<dd class="font-mono text-xs text-gray-500">{user?.id}</dd>
					</div>
					<div class="flex items-center justify-between">
						<dt class="text-sm text-gray-400">Custom ID</dt>
						<dd class="font-mono text-sm font-bold text-blue-400">{user?.custom_id ?? '—'}</dd>
					</div>
				</dl>
			</div>

			<div class="rounded-2xl border border-white/10 bg-white/5 p-6">
				<h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
					Pengaturan
				</h3>
				<a
					href="/profile/settings"
					class="inline-flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
				>
					Ubah pengaturan profil
				</a>
			</div>
		</div>
	</div>
</div>
