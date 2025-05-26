import type { NextApiRequest, NextApiResponse } from 'next';

// Dummy in-memory data store for payments
let payments = [
  { id: 1, representativeId: 1, amount: 50000, date: '1402/02/10', note: 'پرداخت نقدی' },
  { id: 2, representativeId: 2, amount: 75000, date: '1402/02/12', note: 'پرداخت آنلاین' },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // Return list of payments
      res.status(200).json(payments);
      break;
    case 'POST':
      // Add new payment
      const { representativeId, amount, date, note } = req.body;
      if (!representativeId || !amount || !date) {
        return res.status(400).json({ message: 'تمام فیلدهای اجباری باید پر شوند' });
      }
      const newPayment = {
        id: payments.length ? payments[payments.length - 1].id + 1 : 1,
        representativeId,
        amount,
        date,
        note: note || '',
      };
      payments.push(newPayment);
      res.status(201).json(newPayment);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`روش ${req.method} مجاز نیست`);
  }
}
