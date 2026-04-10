import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { handle as authHandle } from './auth';

const handlePreload: Handle = ({ event, resolve }) =>
        resolve(event, {
                preload: ({ type }) => type === 'font' || type === 'js' || type === 'css'
        });

const handleParaglide: Handle = ({ event, resolve }) =>
        paraglideMiddleware(event.request, ({ request, locale }) => {
                event.request = request;

                return resolve(event, {
                        transformPageChunk: ({ html }) => html.replace('%lang%', locale)
                });
        });

const protectedRoutes = ['/profile', '/profile/settings'];

const handleAuthGuard: Handle = async ({ event, resolve }) => {
        const isProtected = protectedRoutes.some((route) => event.url.pathname.startsWith(route));

        if (isProtected) {
                try {
                        const session = await event.locals.auth();
                        if (!session) {
                                throw redirect(303, `/login?redirectTo=${encodeURIComponent(event.url.pathname)}`);
                        }
                } catch (e) {
                        const err = e as { status?: number };
                        if (err?.status === 303) throw e;
                }
        }

        return resolve(event);
};

export const handle: Handle = sequence(handlePreload, authHandle, handleParaglide, handleAuthGuard);
