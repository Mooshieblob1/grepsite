---
// src/pages/api/auth/login.ts
import type { APIRoute } from 'astro';
import { getUsers } from '../../../lib/data';

export const POST: APIRoute = async ({ request, cookies }) => {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return new Response(JSON.stringify({ message: 'Email and password are required' }), { status: 400 });
  }

  const users = await getUsers();
  const user = users.find(u => u.email === email && u.password === password); // In a real app, hash passwords!

  if (!user) {
    return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
  }

  // Create a simple session token (in a real app, use a secure method like JWT)
  const sessionToken = btoa(`${user.id}:${Date.now() + 3600 * 1000}`); 
  
  cookies.set('session', sessionToken, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    maxAge: 3600, // 1 hour
  });

  return new Response(JSON.stringify({ message: 'Login successful', redirectTo: '/' }), { status: 200 });
};
