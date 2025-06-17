import { useState } from 'react';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import InvoiceForm from '../components/InvoiceForm';

export default function App() {
  const [refresh, setRefresh] = useState(false);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Sistema de Facturación PYME</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <ProductForm onSuccess={() => setRefresh(!refresh)} />
          <ProductList refresh={refresh} />
        </div>
        <div>
          <InvoiceForm />
        </div>
      </div>
    </div>
  );
}
