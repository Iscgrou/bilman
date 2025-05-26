import type { NextApiRequest, NextApiResponse } from 'next';

// Dummy data for demonstration
const payments = [
  { id: 1, representativeId: 1, amount: 50000, date: '1402/02/10', note: 'پرداخت نقدی' },
  { id: 2, representativeId: 2, amount: 75000, date: '1402/02/12', note: 'پرداخت آنلاین' },
];

const invoices = [
  { id: 1, representativeId: 1, amount: 100000, status: 'پرداخت نشده', date: '1402/02/01' },
  { id: 2, representativeId: 2, amount: 150000, status: 'پرداخت شده', date: '1402/02/05' },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`روش ${req.method} مجاز نیست`);
  }

  // Example: generate a simple reconciliation report
  const report = invoices.map((invoice) => {
    const payment = payments.find((p) => p.representativeId === invoice.representativeId && p.amount === invoice.amount);
    return {
      invoiceId: invoice.id,
      representativeId: invoice.representativeId,
      invoiceAmount: invoice.amount,
      paymentStatus: payment ? 'پرداخت شده' : 'پرداخت نشده',
      paymentDate: payment ? payment.date : null,
    };
  });

  res.status(200).json(report);
}
