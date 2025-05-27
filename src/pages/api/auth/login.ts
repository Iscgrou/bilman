import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Dummy user data for demonstration
const users = [
  {
    id: 1,
    username: 'operator',
    passwordHash: '$2a$10$7Q9Q1vQ6vQ6vQ6vQ6vQ6vOQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6v', // bcrypt hash for 'password123'
  },
];

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'نام کاربری یا رمز عبور اشتباه است' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'نام کاربری یا رمز عبور اشتباه است' });
  }

  const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: '1h',
  });

  res.setHeader(
    'Set-Cookie',
    `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict; Secure`
  );

  return res.status(200).json({ message: 'ورود موفقیت آمیز بود' });
}
