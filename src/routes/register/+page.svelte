<script lang="ts">
        import { enhance } from '$app/forms';
        import type { ActionData } from './$types';

        let { form }: { form: ActionData } = $props();

        let loading = $state(false);
        let password = $state('');
        let showPasswordStrength = $state(false);

        function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
                if (pw.length === 0) return { label: '', color: '', width: '0%' };
                if (pw.length < 6) return { label: 'Lemah', color: 'bg-red-500', width: '25%' };
                if (pw.length < 8) return { label: 'Cukup', color: 'bg-yellow-500', width: '50%' };
                if (pw.length < 12 && /[A-Z]/.test(pw) && /[0-9]/.test(pw))
                        return { label: 'Kuat', color: 'bg-green-500', width: '75%' };
                if (pw.length >= 12 && /[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[^a-zA-Z0-9]/.test(pw))
                        return { label: 'Sangat Kuat', color: 'bg-emerald-500', width: '100%' };
                return { label: 'Sedang', color: 'bg-blue-500', width: '60%' };
        }

        const strength = $derived(getPasswordStrength(password));
</script>

<svelte:head>
        <title>Daftar - Playreia</title>
</svelte:head>

<div class="flex min-h-[85vh] items-center justify-center px-4 py-16">
        <div class="w-full max-w-md">
                <div class="mb-8 text-center">
                        <h1 class="text-3xl font-bold text-white">Buat Akun Baru</h1>
                        <p class="mt-2 text-sm text-gray-400">Bergabunglah dengan komunitas Playreia</p>
                </div>

                <div class="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                        {#if form?.error}
                                <div class="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                        {form.error}
                                </div>
                        {/if}

                        <form
                                method="POST"
                                action="?/register"
                                use:enhance={() => {
                                        loading = true;
                                        return async ({ update }) => {
                                                loading = false;
                                                await update();
                                        };
                                }}
                        >
                                <div class="mb-5">
                                        <label for="name" class="mb-2 block text-sm font-medium text-gray-300">
                                                Nama Lengkap
                                        </label>
                                        <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                autocomplete="name"
                                                required
                                                minlength="2"
                                                value={form?.name ?? ''}
                                                placeholder="Nama kamu"
                                                class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                </div>

                                <div class="mb-5">
                                        <label for="email" class="mb-2 block text-sm font-medium text-gray-300">
                                                Email
                                        </label>
                                        <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autocomplete="email"
                                                required
                                                value={form?.email ?? ''}
                                                placeholder="kamu@email.com"
                                                class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                </div>

                                <div class="mb-5">
                                        <label for="password" class="mb-2 block text-sm font-medium text-gray-300">
                                                Password
                                        </label>
                                        <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                autocomplete="new-password"
                                                required
                                                minlength="8"
                                                bind:value={password}
                                                onfocus={() => (showPasswordStrength = true)}
                                                placeholder="Minimal 8 karakter"
                                                class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        {#if showPasswordStrength && password.length > 0}
                                                <div class="mt-2">
                                                        <div class="h-1.5 w-full rounded-full bg-white/10">
                                                                <div
                                                                        class="h-1.5 rounded-full transition-all duration-300 {strength.color}"
                                                                        style="width: {strength.width}"
                                                                ></div>
                                                        </div>
                                                        <p class="mt-1 text-xs text-gray-400">
                                                                Kekuatan: <span class="font-medium text-white">{strength.label}</span>
                                                        </p>
                                                </div>
                                        {/if}
                                </div>

                                <div class="mb-7">
                                        <label for="confirmPassword" class="mb-2 block text-sm font-medium text-gray-300">
                                                Konfirmasi Password
                                        </label>
                                        <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                autocomplete="new-password"
                                                required
                                                placeholder="Ulangi password kamu"
                                                class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                </div>

                                <button
                                        type="submit"
                                        disabled={loading}
                                        class="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                        {loading ? 'Mendaftar...' : 'Buat Akun'}
                                </button>
                        </form>

                        <div class="relative my-6">
                                <div class="absolute inset-0 flex items-center">
                                        <div class="w-full border-t border-white/10"></div>
                                </div>
                                <div class="relative flex justify-center text-sm">
                                        <span class="bg-transparent px-2 text-gray-500">atau daftar dengan</span>
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
                                        Daftar dengan Google
                                </button>
                        </form>

                        <p class="mt-6 text-center text-sm text-gray-400">
                                Sudah punya akun?
                                <a href="/login" class="font-semibold text-blue-400 hover:text-blue-300">
                                        Masuk di sini
                                </a>
                        </p>
                </div>
        </div>
</div>
