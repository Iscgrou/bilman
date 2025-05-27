import type { NextApiRequest, NextApiResponse } from 'next';

// Dummy in-memory data store for representatives
let representatives = [
  { id: 1, name: 'نماینده ۱', phone: '09120000001', email: 'rep1@example.com' },
  { id: 2, name: 'نماینده ۲', phone: '09120000002', email: 'rep2@example.com' },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  const repId = Number(id);
  const repIndex = representatives.findIndex((r) => r.id === repId);

  if (repIndex === -1) {
    return res.status(404).json({ message: 'نماینده یافت نشد' });
  }

  switch (method) {
    case 'GET':
      res.status(200).json(representatives[repIndex]);
      break;
    case 'PUT':
      const { name, phone, email } = req.body;
      if (!name || !phone || !email) {
        return res.status(400).json({ message: 'تمام فیلدها باید پر شوند' });
      }
      representatives[repIndex] = { id: repId, name, phone, email };
      res.status(200).json(representatives[repIndex]);
      break;
    case 'DELETE':
      representatives.splice(repIndex, 1);
      res.status(204).end();
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`روش ${method} مجاز نیست`);
  }
}
