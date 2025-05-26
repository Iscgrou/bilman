import type { NextApiRequest, NextApiResponse } from 'next';

// Dummy in-memory data store for representatives
let representatives = [
  { id: 1, name: 'نماینده ۱', phone: '09120000001', email: 'rep1@example.com' },
  { id: 2, name: 'نماینده ۲', phone: '09120000002', email: 'rep2@example.com' },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // Return list of representatives
      res.status(200).json(representatives);
      break;
    case 'POST':
      // Add new representative
      const { name, phone, email } = req.body;
      if (!name || !phone || !email) {
        return res.status(400).json({ message: 'تمام فیلدها باید پر شوند' });
      }
      const newRep = {
        id: representatives.length ? representatives[representatives.length - 1].id + 1 : 1,
        name,
        phone,
        email,
      };
      representatives.push(newRep);
      res.status(201).json(newRep);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`روش ${req.method} مجاز نیست`);
  }
}
