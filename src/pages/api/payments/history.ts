import type { NextApiRequest, NextApiResponse } from 'next';

// Dummy in-memory data store for payments with representativeId
let payments = [
  { id: 1, representativeId: 1, amount: 50000, date: '1402/02/10', note: 'پرداخت نقدی' },
  { id: 2, representativeId: 2, amount: 75000, date: '1402/02/12', note: 'پرداخت آنلاین' },
  { id: 3, representativeId: 1, amount: 25000, date: '1402/02/15', note: 'پرداخت نقدی' },
];

// Get payment history for a representative
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`روش ${req.method} مجاز نیست`);
  }

  const { representativeId } = req.query;
  if (!representativeId) {
    return res.status(400).json({ message: 'شناسه نماینده لازم است' });
  }

  const repId = Number(representativeId);
  const repPayments = payments.filter(p => p.representativeId === repId);

  res.status(200).json(repPayments);
}
