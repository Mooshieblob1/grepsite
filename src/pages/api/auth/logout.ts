import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ cookies }) => {
  // Clear the session cookie
  cookies.delete('session');
  
  return new Response(null, {
    status: 302,
    headers: { 'Location': '/login' }
  });
};

export const GET: APIRoute = async ({ cookies }) => {
  // Clear the session cookie
  cookies.delete('session');
  
  return new Response(null, {
    status: 302,
    headers: { 'Location': '/login' }
  });
};
