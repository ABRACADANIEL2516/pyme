import { Router } from 'express';
import pool from '../db.js';
import PDFDocument from 'pdfkit';
import { sendInvoiceMail } from '../mail.js';
import fs from 'fs';
import path from 'path';

const router = Router();


async function generateInvoicePDF(invoiceId) {

  const [[invoice]] = await pool.query('SELECT * FROM invoices WHERE id=?', [invoiceId]);
  const [items] = await pool.query(
    `SELECT ii.*, p.name FROM invoice_items ii
     JOIN products p ON p.id = ii.product_id WHERE ii.invoice_id=?`,
    [invoiceId]
  );
  const doc = new PDFDocument();
  const filename = `invoice_${invoiceId}.pdf`;
  const pdfPath = path.join('invoices', filename);
  await fs.promises.mkdir('invoices', { recursive: true });
  doc.pipe(fs.createWriteStream(pdfPath));

  doc.fontSize(20).text('Factura', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Número: ${invoice.id}`);
  const dateObj = new Date(invoice.date);
  const fechaStr = dateObj.toLocaleString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  doc.text(`Fecha: ${fechaStr}`);
  doc.moveDown();
  doc.fontSize(12);
  let total = 0;
  items.forEach((it) => {
    doc.text(`${it.name} x${it.quantity} - $${it.price}`);
    total += it.price * it.quantity;
  });
  doc.moveDown();
  doc.fontSize(14).text(`Total: $${total.toFixed(2)}`);
  doc.end();
  return pdfPath;
}


router.post('/', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { items, email } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items required' });
    }
    await conn.beginTransaction();
    const [invRes] = await conn.query('INSERT INTO invoices () VALUES ()');
    const invoiceId = invRes.insertId;
    for (const it of items) {
      const [[product]] = await conn.query('SELECT * FROM products WHERE id=?', [it.productId]);
      if (!product) throw new Error('Product not found');
      await conn.query(
        'INSERT INTO invoice_items (invoice_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [invoiceId, product.id, it.quantity, product.price]
      );
    }
    await conn.commit();
    const pdfFile = await generateInvoicePDF(invoiceId);
    if (email) {
      try {
        await sendInvoiceMail(email, pdfFile, invoiceId);
      } catch (e) {
        console.error('Email error', e);
      }
    }
    res.json({ invoiceId, pdf: `http://localhost:${process.env.PORT}/${pdfFile}` });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

export default router;
