<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<svelte:head>
	<title>Keluar - Playreia</title>
</svelte:head>

<div class="flex min-h-[70vh] items-center justify-center px-4">
	<div class="w-full max-w-sm text-center">
		<div class="rounded-2xl border border-white/10 bg-white/5 p-8">
			<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
				<svg class="h-8 w-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
				</svg>
			</div>
			<h1 class="text-xl font-bold text-white">Keluar dari Akun?</h1>
			<p class="mt-2 text-sm text-gray-400">Kamu akan keluar dari sesi ini.</p>

			<form method="POST" use:enhance class="mt-6 space-y-3">
				<button
					type="submit"
					class="w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-500"
				>
					Ya, Keluar
				</button>
				<a
					href="/profile"
					class="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-medium text-gray-300 transition-colors hover:bg-white/10"
				>
					Batal
				</a>
			</form>
		</div>
	</div>
</div>
