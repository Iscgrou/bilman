import type { NextApiRequest, NextApiResponse } from 'next';

// Dummy in-memory data store for invoices
let invoices = [
  { id: 1, representativeId: 1, amount: 100000, status: 'پرداخت نشده', date: '1402/02/01' },
  { id: 2, representativeId: 2, amount: 150000, status: 'پرداخت شده', date: '1402/02/05' },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // Return list of invoices
      res.status(200).json(invoices);
      break;
    case 'POST':
      // Add new invoice
      const { representativeId, amount, status, date } = req.body;
      if (!representativeId || !amount || !status || !date) {
        return res.status(400).json({ message: 'تمام فیلدها باید پر شوند' });
      }
      const newInvoice = {
        id: invoices.length ? invoices[invoices.length - 1].id + 1 : 1,
        representativeId,
        amount,
        status,
        date,
      };
      invoices.push(newInvoice);
      res.status(201).json(newInvoice);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`روش ${req.method} مجاز نیست`);
  }
}
