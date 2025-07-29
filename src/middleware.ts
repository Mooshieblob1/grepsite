import { defineMiddleware } from "astro:middleware";
import { DataService } from "./lib/data";

const protectedRoutes = [
    '/', '/carriers', '/inventory', '/invoices', '/lines', '/lines-new', '/lines-old',
    '/profile', '/reporting', '/settings', '/tickets', '/usage-analytics', '/users'
];

export const onRequest = defineMiddleware(async (context, next) => {
    const { cookies, locals, url } = context;
    const pathname = url.pathname;

    // Bypass middleware for API routes and static assets
    if (pathname.startsWith('/api/') || pathname.includes('.')) {
        return next();
    }

    const sessionId = cookies.get('session_id')?.value;
    
    if (protectedRoutes.includes(pathname)) {
        if (!sessionId) {
            return new Response(null, { status: 302, headers: { 'Location': `/login?redirect=${pathname}` } });
        }

        try {
            const sessionData = await locals.runtime.env.SESSION.get(sessionId);
            if (!sessionData) {
                cookies.delete('session_id', { path: '/' });
                return new Response(null, { status: 302, headers: { 'Location': `/login?redirect=${pathname}` } });
            }
            const user = JSON.parse(sessionData);
            locals.user = user;
        } catch (error) {
            console.error("Middleware session error:", error);
            cookies.delete('session_id', { path: '/' });
            return new Response(null, { status: 302, headers: { 'Location': '/login' } });
        }
    }

    if (pathname === '/login') {
        if (sessionId) {
            const sessionData = await locals.runtime.env.SESSION.get(sessionId);
            if (sessionData) {
                return new Response(null, { status: 302, headers: { 'Location': '/' } });
            }
        }
    }

    return next();
});
