import type { NextApiRequest, NextApiResponse } from 'next';

// Dummy data for demonstration
const monthlySales = [100000, 150000, 120000, 180000, 200000, 170000];
const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور'];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`روش ${req.method} مجاز نیست`);
  }

  res.status(200).json({
    months,
    monthlySales,
  });
}
