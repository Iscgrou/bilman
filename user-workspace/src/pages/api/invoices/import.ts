import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File, Files } from 'formidable';
import fs from 'fs';
import * as XLSX from 'xlsx';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface Invoice {
  id: number;
  representativeId: number;
  amount: number;
  status: string;
  date: string;
}

let invoices: Invoice[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`روش ${req.method} مجاز نیست`);
  }

  const form = new formidable.IncomingForm();

  form.parse(req, (err: any, fields: any, files: Files) => {
    if (err) {
      return res.status(500).json({ message: 'خطا در پردازش فایل' });
    }

    const file = files.file;
    if (!file || Array.isArray(file)) {
      return res.status(400).json({ message: 'فایل معتبر نیست' });
    }

    const data = fs.readFileSync((file as File).filepath);
    const workbook = XLSX.read(data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Process jsonData and add to invoices array
    jsonData.forEach((row: any) => {
      invoices.push({
        id: invoices.length ? invoices[invoices.length - 1].id + 1 : 1,
        representativeId: row['representativeId'] || row['نماینده'] || 0,
        amount: row['amount'] || row['مبلغ'] || 0,
        status: row['status'] || row['وضعیت'] || 'پرداخت نشده',
        date: row['date'] || row['تاریخ'] || '',
      });
    });

    res.status(200).json({ message: 'فاکتورها با موفقیت وارد شدند', count: jsonData.length });
  });
}
