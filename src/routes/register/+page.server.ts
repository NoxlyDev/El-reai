import { redirect, fail } from '@sveltejs/kit';
import { signIn } from '../../auth';
import { prisma } from '$lib/server/prisma';
import { generateUniqueCustomId } from '$lib/server/dynamic-id';
import bcrypt from 'bcryptjs';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();
	if (session) {
		throw redirect(303, '/profile');
	}
	return {};
};

export const actions: Actions = {
	register: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		if (!name || !email || !password || !confirmPassword) {
			return fail(400, {
				error: 'Semua field wajib diisi.',
				name,
				email
			});
		}

		if (name.trim().length < 2) {
			return fail(400, {
				error: 'Nama minimal 2 karakter.',
				name,
				email
			});
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, {
				error: 'Format email tidak valid.',
				name,
				email
			});
		}

		if (password.length < 8) {
			return fail(400, {
				error: 'Password minimal 8 karakter.',
				name,
				email
			});
		}

		if (password !== confirmPassword) {
			return fail(400, {
				error: 'Password dan konfirmasi password tidak cocok.',
				name,
				email
			});
		}

		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return fail(409, {
				error: 'Email sudah terdaftar. Silakan gunakan email lain atau login.',
				name,
				email
			});
		}

		const hashedPassword = await bcrypt.hash(password, 12);
		const custom_id = await generateUniqueCustomId();

		await prisma.user.create({
			data: {
				name: name.trim(),
				email,
				password: hashedPassword,
				custom_id
			}
		});

		try {
			await signIn('credentials', {
				email,
				password,
				redirectTo: '/profile'
			});
		} catch (error) {
			const err = error as Error;
			if (err.message?.includes('NEXT_REDIRECT') || err.message?.includes('redirect')) {
				throw error;
			}
		}

		throw redirect(303, '/login?registered=true');
	}
};
