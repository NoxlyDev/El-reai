import { redirect, fail } from '@sveltejs/kit';
import { signIn } from '../../auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();
	if (session) {
		throw redirect(303, '/profile');
	}
	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const redirectTo = (formData.get('redirectTo') as string) || '/profile';

		if (!email || !password) {
			return fail(400, {
				error: 'Email dan password wajib diisi.',
				email
			});
		}

		try {
			await signIn('credentials', {
				email,
				password,
				redirectTo
			});
		} catch (error) {
			const err = error as Error;
			if (err.message?.includes('NEXT_REDIRECT') || err.message?.includes('redirect')) {
				throw error;
			}
			return fail(401, {
				error: 'Email atau password salah.',
				email
			});
		}

		throw redirect(303, redirectTo);
	}
};
