import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import bcrypt from 'bcryptjs';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();

	if (!session || !session.user) {
		throw redirect(303, '/login?redirectTo=/profile/settings');
	}

	return { session };
};

export const actions: Actions = {
	updateProfile: async (event) => {
		const session = await event.locals.auth();
		if (!session?.user?.id) {
			return fail(401, { updateProfile: { error: 'Tidak terautentikasi.' } });
		}

		const formData = await event.request.formData();
		const name = (formData.get('name') as string)?.trim();

		if (!name || name.length < 2) {
			return fail(400, {
				updateProfile: { error: 'Nama harus minimal 2 karakter.' }
			});
		}

		if (name.length > 50) {
			return fail(400, {
				updateProfile: { error: 'Nama tidak boleh lebih dari 50 karakter.' }
			});
		}

		await prisma.user.update({
			where: { id: session.user.id },
			data: { name }
		});

		return { updateProfile: { success: true } };
	},

	updateEmail: async (event) => {
		const session = await event.locals.auth();
		if (!session?.user?.id) {
			return fail(401, { updateEmail: { error: 'Tidak terautentikasi.' } });
		}

		const formData = await event.request.formData();
		const email = (formData.get('email') as string)?.trim().toLowerCase();

		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return fail(400, { updateEmail: { error: 'Format email tidak valid.' } });
		}

		if (email === session.user.email) {
			return fail(400, {
				updateEmail: { error: 'Email baru sama dengan email saat ini.' }
			});
		}

		const existing = await prisma.user.findUnique({ where: { email } });
		if (existing) {
			return fail(400, {
				updateEmail: { error: 'Email sudah digunakan oleh akun lain.' }
			});
		}

		await prisma.user.update({
			where: { id: session.user.id },
			data: { email }
		});

		return { updateEmail: { success: true } };
	},

	changePassword: async (event) => {
		const session = await event.locals.auth();
		if (!session?.user?.id) {
			return fail(401, { changePassword: { error: 'Tidak terautentikasi.' } });
		}

		const formData = await event.request.formData();
		const currentPassword = formData.get('currentPassword') as string;
		const newPassword = formData.get('newPassword') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		if (!currentPassword || !newPassword || !confirmPassword) {
			return fail(400, {
				changePassword: { error: 'Semua kolom wajib diisi.' }
			});
		}

		if (newPassword.length < 8) {
			return fail(400, {
				changePassword: { error: 'Password baru harus minimal 8 karakter.' }
			});
		}

		if (newPassword !== confirmPassword) {
			return fail(400, {
				changePassword: { error: 'Konfirmasi password tidak cocok.' }
			});
		}

		const user = await prisma.user.findUnique({ where: { id: session.user.id } });

		if (!user?.password) {
			return fail(400, {
				changePassword: {
					error: 'Akun ini menggunakan login pihak ketiga dan tidak memiliki password.'
				}
			});
		}

		const isValid = await bcrypt.compare(currentPassword, user.password);
		if (!isValid) {
			return fail(401, {
				changePassword: { error: 'Password saat ini tidak benar.' }
			});
		}

		const hashed = await bcrypt.hash(newPassword, 12);
		await prisma.user.update({
			where: { id: session.user.id },
			data: { password: hashed }
		});

		return { changePassword: { success: true } };
	}
};
