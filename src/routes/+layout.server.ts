import { CANONICAL_ORIGIN } from '$lib/info';
import { baseLocale, extractLocaleFromUrl, localizeUrl } from '$lib/paraglide/runtime';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url, locals }) => {
	const canonical_url = new URL(`${CANONICAL_ORIGIN + url.pathname}`).toString();
	const session = await locals.auth();

	return {
		session,
		url: localizeUrl(canonical_url).toString(),
		locale: extractLocaleFromUrl(canonical_url) ?? baseLocale
	};
};
