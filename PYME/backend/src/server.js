import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import productsRouter from './routes/products.js';
import invoicesRouter from './routes/invoices.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/products', productsRouter);
app.use('/invoices', invoicesRouter);
app.use('/invoices', express.static(path.resolve('invoices')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
