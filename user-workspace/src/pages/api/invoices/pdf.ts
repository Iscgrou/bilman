import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

let invoices = [
  { id: 1, representativeId: 1, amount: 100000, status: 'پرداخت نشده', date: '1402/02/01' },
  { id: 2, representativeId: 2, amount: 150000, status: 'پرداخت شده', date: '1402/02/05' },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`روش ${req.method} مجاز نیست`);
  }

  const { id } = req.query;
  const invoice = invoices.find((inv) => inv.id === Number(id));

  if (!invoice) {
    return res.status(404).json({ message: 'فاکتور یافت نشد' });
  }

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    const htmlContent = `
      <html lang="fa" dir="rtl">
        <head>
          <style>
            body { font-family: Vazirmatn, Sahel, sans-serif; padding: 20px; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: right; }
          </style>
        </head>
        <body>
          <h1>فاکتور شماره ${invoice.id}</h1>
          <table>
            <tr><th>نماینده</th><td>${invoice.representativeId}</td></tr>
            <tr><th>مبلغ</th><td>${invoice.amount.toLocaleString()}</td></tr>
            <tr><th>وضعیت</th><td>${invoice.status}</td></tr>
            <tr><th>تاریخ</th><td>${invoice.date}</td></tr>
          </table>
        </body>
      </html>
    `;

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice_${invoice.id}.pdf`);
    res.status(200).send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: 'خطا در تولید PDF' });
  }
}
