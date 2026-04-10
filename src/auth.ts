import { SvelteKitAuth } from '@auth/sveltekit';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from '@auth/sveltekit/providers/credentials';
import Google from '@auth/sveltekit/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from '$lib/server/prisma';
import { generateUniqueCustomId } from '$lib/server/dynamic-id';

const prismaAdapter = PrismaAdapter(prisma);

export const { handle, signIn, signOut } = SvelteKitAuth({
	adapter: {
		...prismaAdapter,
		createUser: async (data) => {
			const custom_id = await generateUniqueCustomId();
			return prismaAdapter.createUser!({ ...data, custom_id } as Parameters<typeof prismaAdapter.createUser>[0]);
		}
	},

	providers: [
		Credentials({
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' }
			},
			authorize: async (credentials) => {
				if (!credentials?.email || !credentials?.password) return null;

				const user = await prisma.user.findUnique({
					where: { email: credentials.email as string }
				});

				if (!user || !user.password) return null;

				const isValid = await bcrypt.compare(
					credentials.password as string,
					user.password
				);

				if (!isValid) return null;

				return {
					id: user.id,
					email: user.email,
					name: user.name,
					image: user.image,
					custom_id: user.custom_id
				};
			}
		}),

		...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
			? [
					Google({
						clientId: process.env.GOOGLE_CLIENT_ID,
						clientSecret: process.env.GOOGLE_CLIENT_SECRET,
						allowDangerousEmailAccountLinking: true
					})
				]
			: [])
	],

	session: {
		strategy: 'jwt'
	},

	callbacks: {
		async jwt({ token, user, trigger }) {
			if (user) {
				token.id = user.id;
				token.custom_id = (user as { custom_id?: string }).custom_id;
			}

			if (trigger === 'update' || (!token.custom_id && token.email)) {
				const dbUser = await prisma.user.findUnique({
					where: { email: token.email as string }
				});
				if (dbUser) {
					token.id = dbUser.id;
					token.custom_id = dbUser.custom_id;
				}
			}

			return token;
		},

		async session({ session, token }) {
			if (token) {
				session.user.id = token.id as string;
				session.user.custom_id = token.custom_id as string;
			}
			return session;
		}
	},

	pages: {
		signIn: '/login',
		error: '/login'
	},

	trustHost: process.env.AUTH_TRUST_HOST === 'true' || process.env.NODE_ENV === 'production',
	secret: process.env.AUTH_SECRET
});
