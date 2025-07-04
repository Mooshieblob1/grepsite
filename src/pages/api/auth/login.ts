import type { APIRoute } from 'astro';
import { DataService } from '../../../lib/data';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const contentType = request.headers.get('content-type');
    let email: string;
    let password: string;

    if (contentType?.includes('application/json')) {
      const data = await request.json();
      email = data.email;
      password = data.password;
    } else {
      const data = await request.formData();
      email = data.get('email') as string;
      password = data.get('password') as string;
    }

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const user = await DataService.getUser(email, password);
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create session
    const sessionData = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: user.permissions
    };

    cookies.set('session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return new Response(JSON.stringify({ success: true, user: sessionData }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
