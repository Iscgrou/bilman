import type { NextApiRequest, NextApiResponse } from 'next';
import bot from './bot';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`روش ${req.method} مجاز نیست`);
  }

  const { chatId, invoiceId } = req.body;

  if (!chatId || !invoiceId) {
    return res.status(400).json({ message: 'پارامترهای chatId و invoiceId الزامی هستند' });
  }

  try {
    // Assuming invoice PDFs are stored in a directory named 'invoices'
    const invoicePath = path.resolve('./invoices', `invoice_${invoiceId}.pdf`);

    if (!fs.existsSync(invoicePath)) {
      return res.status(404).json({ message: 'فاکتور یافت نشد' });
    }

    const fileStream = fs.createReadStream(invoicePath);

    await bot.sendDocument(chatId, fileStream, {
      caption: `فاکتور شماره ${invoiceId}`,
    });

    res.status(200).json({ message: 'فاکتور با موفقیت ارسال شد' });
  } catch (error) {
    res.status(500).json({ message: 'خطا در ارسال فاکتور' });
  }
}
