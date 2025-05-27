import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// In a real application, you would validate against a database
const MOCK_USERS = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'admin'
  },
  {
    username: 'operator',
    password: 'operator123',
    role: 'operator'
  }
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const user = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { message: 'نام کاربری یا رمز عبور اشتباه است.' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = sign(
      { username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set cookie
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 1 day
    });

    return NextResponse.json(
      { message: 'ورود موفقیت‌آمیز' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'خطای سرور' },
      { status: 500 }
    );
  }
}
