import type { NextApiRequest, NextApiResponse } from 'next';

// Dummy in-memory data store for representatives with referral info
let representatives = [
  { id: 1, name: 'نماینده ۱', phone: '09120000001', email: 'rep1@example.com', referrerId: null },
  { id: 2, name: 'نماینده ۲', phone: '09120000002', email: 'rep2@example.com', referrerId: 1 },
  { id: 3, name: 'نماینده ۳', phone: '09120000003', email: 'rep3@example.com', referrerId: 2 },
];

interface RepresentativeWithReferrals {
  id: number;
  name: string;
  phone: string;
  email: string;
  referrerId: number | null;
  referrals: RepresentativeWithReferrals[];
}

// Helper function to build referral tree
function buildReferralTree(repId: number): RepresentativeWithReferrals[] {
  const directRefs = representatives.filter(r => r.referrerId === repId);
  return directRefs.map((r): RepresentativeWithReferrals => ({
    ...r,
    referrals: buildReferralTree(r.id),
  }));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`روش ${req.method} مجاز نیست`);
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ message: 'شناسه نماینده لازم است' });
  }

  const repId = Number(id);
  const rep = representatives.find(r => r.id === repId);
  if (!rep) {
    return res.status(404).json({ message: 'نماینده یافت نشد' });
  }

  const referralTree = buildReferralTree(repId);

  res.status(200).json({ representative: rep, referralTree });
}
