import { redirect } from '@sveltejs/kit';
import { signOut } from '../../auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();
	if (!session) {
		throw redirect(303, '/login');
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		await signOut(event, { redirectTo: '/' });
	}
};
