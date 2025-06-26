import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendInvoiceMail(to, pdfPath, invoiceId) {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject: `Factura #${invoiceId}`,
    text: `Adjuntamos la factura #${invoiceId}.`,
    attachments: [
      {
        filename: path.basename(pdfPath),
        path: pdfPath,
      },
    ],
  };
  await transporter.sendMail(mailOptions);
}
