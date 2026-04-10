<script lang="ts">
	import { baseLocale, getLocale, type Locale, setLocale } from '$lib/paraglide/runtime';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import User3Fill from '~icons/mingcute/user-3-fill';
	import Back from '~icons/mingcute/back-fill';
	import { LOCALES } from '$lib/info';

	type Screens = 'main' | 'language';

	let closeInterval: ReturnType<typeof setTimeout> | undefined = undefined;
	let copyInterval: ReturnType<typeof setTimeout> | undefined = $state(undefined);
	let currentScreen: Screens = $state('main');
	let isOpen = $state(false);

	// Session dari SSR layout (tersedia langsung untuk halaman SSR)
	const serverSession = $derived($page.data.session);

	// Session tambahan via client-side fetch (untuk halaman yang di-prerender)
	let clientSession:
		| {
				user?: {
					name?: string | null;
					email?: string | null;
					image?: string | null;
					custom_id?: string;
				};
		  }
		| null
		| undefined = $state(undefined);

	onMount(async () => {
		if (!serverSession) {
			try {
				const res = await fetch('/auth/session');
				if (res.ok) {
					const data = await res.json();
					clientSession = data?.user ? data : null;
				} else {
					clientSession = null;
				}
			} catch {
				clientSession = null;
			}
		}
	});

	// Gunakan session dari server jika tersedia, jika tidak gunakan hasil fetch client-side
	const session = $derived(serverSession ?? clientSession);

	const account = $derived(
		session?.user
			? {
					// Ambil max 2 kata dari nama Google, atau prefix email jika nama kosong
					name: session.user.name
						? session.user.name.split(' ').slice(0, 2).join(' ')
						: (session.user.email?.split('@')[0] ?? 'User'),
					username: (session.user as { custom_id?: string }).custom_id ?? '',
					email: session.user.email ?? '',
					image: session.user.image ?? null
				}
			: null
	);

	function closeMenu() {
		isOpen = false;
		document.removeEventListener('click', onClickOutside);
		document.removeEventListener('keydown', onClickOutsideKeydown);
		resetScreen();
	}
	function resetScreen() {
		if (closeInterval) clearTimeout(closeInterval);
		closeInterval = setTimeout(() => {
			currentScreen = 'main';
		}, 300);
	}
	function onClick() {
		isOpen = !isOpen;
		if (isOpen) {
			document.addEventListener('click', onClickOutside);
			document.addEventListener('keydown', onClickOutsideKeydown);
			if (closeInterval) {
				clearTimeout(closeInterval);
				closeInterval = undefined;
			}
		} else {
			document.removeEventListener('click', onClickOutside);
			document.removeEventListener('keydown', onClickOutsideKeydown);
			resetScreen();
		}
	}
	function onClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		const navAccount = document.getElementById('nav-account-container');
		if (navAccount && !navAccount.contains(target)) {
			closeMenu();
		}
	}
	function onClickOutsideKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeMenu();
		}
	}
	function openLocale() {
		setTimeout(() => {
			currentScreen = 'language';
		}, 0);
	}
	function goBack() {
		setTimeout(() => {
			currentScreen = 'main';
		}, 0);
	}
	function handleCopyUsername(event: MouseEvent | KeyboardEvent) {
		event.stopPropagation();
		if (copyInterval) clearTimeout(copyInterval);
		navigator.clipboard.writeText(account!.username);
		const el = event.currentTarget as HTMLElement;
		el.classList.add('copied');
		copyInterval = setTimeout(() => {
			el.classList.remove('copied');
		}, 2000);
	}
	function logout() {
		closeMenu();
	}
</script>

<div id="nav-account-container">
	<button
		id="nav-account-button"
		onclick={onClick}
		aria-label="Account and Settings"
		role="menubar"
		tabindex="0"
		aria-controls="nav-account-dropdown"
		class:open={isOpen}
	>
		<User3Fill />
	</button>
	<div id="nav-account-dropdown" class:open={isOpen}>
		<div class="nav-account-main">
			<div class:hidden={currentScreen !== 'main'}>
				{#if account}
					<div class="menu-section !flex-row">
						<div class="profile-icon">{account.name.charAt(0).toUpperCase()}</div>
						<div class="account-info">
							<span class="account-name" title={account.name}>{account.name}</span>
							{#if account.username}
								<span
									class="account-id"
									tabindex="0"
									role="button"
									aria-label="Copy username"
									title="Klik untuk copy"
									onclick={(e) => {
										e.stopPropagation();
										handleCopyUsername(e);
									}}
									onkeydown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											handleCopyUsername(e);
										}
									}}
								>
									@{account.username}
								</span>
							{/if}
						</div>
					</div>
					<div class="menu-section">
						<a href="/profile" role="menuitem" aria-label="Profil Saya" onclick={onClick}>
							Profil Saya
						</a>
						<a
							href="/profile/settings"
							role="menuitem"
							aria-label="Pengaturan Akun"
							onclick={onClick}
						>
							Pengaturan
						</a>
						<a href="/logout" role="menuitem" aria-label="Keluar" class="logout-link" onclick={logout}>
							Keluar
						</a>
					</div>
				{:else}
					<div class="menu-section">
						<a href="/login" role="menuitem" aria-label="Login" onclick={onClick}>Login</a>
						<a href="/register" role="menuitem" aria-label="Register" onclick={onClick}>Register</a>
					</div>
				{/if}
				<div class="menu-section">
					<button role="menuitem" aria-label="Ganti Bahasa" onclick={openLocale}>
						Ganti Bahasa
					</button>
				</div>
			</div>
			<div class:hidden={currentScreen !== 'language'}>
				<button class="back" role="menuitem" aria-label="Kembali" onclick={goBack}>
					<Back />
					<span>Kembali</span>
				</button>
				<div class="menu-section">
					{#each Object.keys(LOCALES) as key}
						<a
							href={'/' + (key === baseLocale ? '' : key)}
							onclick={() => {
								setLocale(key as Locale);
							}}
							class:selected={getLocale() === key}
						>
							{LOCALES[key as Locale]}
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	@reference '$appcss';

	@keyframes fadeOut {
		from {
			visibility: visible;
		}
		to {
			visibility: hidden;
		}
	}

	#nav-account-container {
		@apply relative;

		#nav-account-button {
			@apply text-r-white/90 text-xl;
			@apply m-0.5 rounded-2xl p-2.5;
			@apply hover:text-black-alt-600 hover:bg-r-white;
			@apply transition-[color_background-color];

			&.open {
				@apply bg-r-white text-black-alt-600;
			}
		}

		#nav-account-dropdown {
			@apply not-mdlg:-right-16 absolute top-full right-0;
			@apply transition-opacity duration-300;
			@apply shadow-float mt-2 bg-white p-2;
			@apply min-w-48 max-w-56 w-56 rounded-2xl opacity-0;
			animation: fadeOut 0.3s ease-in-out forwards;

			&.open {
				animation: none;
				@apply !visible !opacity-100;
			}

			.menu-section {
				@apply text-black-alt-600/80 text-sm;
				@apply flex flex-col pb-2;

				+ .menu-section {
					@apply border-r-border-silver/35 border-t-1 pt-2;
				}

				.profile-icon {
					@apply bg-blue-alt-600 mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full;
					@apply text-lg font-bold text-white;
				}

				.account-info {
					@apply flex flex-col min-w-0 overflow-hidden;

					.account-name {
						@apply text-black-alt-600 text-md font-bold truncate;
					}
					.account-id {
						@apply text-black-alt-400 text-xs cursor-pointer truncate;
					}
				}

				a,
				button {
					@apply text-black-alt-600 no-underline;
					@apply p-2 text-left font-medium;
					@apply border-blue-alt-600/75 hover:border-r-3;
					line-height: 1.25;

					&.selected {
						@apply border-blue-alt-600/20 hover:border-blue-alt-600/75 border-r-3 font-bold;
					}
				}

				a.logout-link {
					@apply mt-2 text-red-500 hover:text-red-600;
				}
			}

			button.back {
				@apply text-black-alt-600/60 hover:text-black-alt-600;
				@apply text-md flex items-center gap-1 px-1 py-3 text-left font-bold;
				line-height: 1.25;
			}
		}
	}
</style>
