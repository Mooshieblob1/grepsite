import type { APIRoute } from 'astro';
import { DataService } from '../../../lib/data';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const contentType = request.headers.get('content-type');
    let email: string;
    let password: string;
    let redirectTo: string;

    if (contentType?.includes('application/json')) {
      const data = await request.json();
      email = data.email;
      password = data.password;
      redirectTo = data.redirectTo || '/';
    } else {
      const data = await request.formData();
      email = data.get('email') as string;
      password = data.get('password') as string;
      redirectTo = data.get('redirectTo') as string || '/'; // Get redirectTo from form
    }

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const user = await DataService.getUser(email, password);

    if (!user) {
      return new Response(
        JSON.stringify({ message: 'Invalid credentials' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Set a session cookie
    const sessionCookie = `session=${encodeURIComponent(JSON.stringify({ email: user.email, name: user.name }))}; HttpOnly; Path=/; Max-Age=3600`;

    return new Response(
      JSON.stringify({ message: 'Logged in successfully', redirectTo }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': sessionCookie
        }
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
