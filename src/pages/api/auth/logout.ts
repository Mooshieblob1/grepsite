// src/pages/api/auth/logout.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete('session', { path: '/' });
  return redirect('/login');
};
