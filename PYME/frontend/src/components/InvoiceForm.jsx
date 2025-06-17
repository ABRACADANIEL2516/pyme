import { useEffect, useState } from 'react';
import api from '../api';

export default function InvoiceForm() {
  const [products, setProducts] = useState([]);
  const [email, setEmail] = useState('');
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    api.get('/products').then((res) => setProducts(res.data));
  }, []);

  const addItem = () => setSelected([...selected, { productId: '', quantity: 1 }]);

  const submit = async (e, withEmail=false) => {
    e.preventDefault();
    try {
      const items = selected.map((i) => ({ productId: i.productId, quantity: i.quantity }));
      const payload = withEmail ? { items, email } : { items };
      const res = await api.post('/invoices', payload);
      window.open(res.data.pdf, '_blank');
      alert('Factura generada');
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const updateItem = (idx, field, value) => {
    setSelected((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it))
    );
  };

  return (
    <form onSubmit={(e)=>submit(e,true)} className="space-y-2">
      <h2 className="text-xl font-semibold">Crear Factura</h2>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Correo del cliente (opcional)"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {selected.map((it, idx) => (
        <div key={idx} className="flex gap-2">
          <select
            className="border p-2 flex-1"
            value={it.productId}
            onChange={(e) => updateItem(idx, 'productId', e.target.value)}
            required
          >
            <option value="">Producto...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            className="border p-2 w-20"
            type="number"
            min="1"
            value={it.quantity}
            onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
            required
          />
        </div>
      ))}
      <button type="button" className="bg-gray-300 px-2" onClick={addItem}>
        + Item
      </button>
      <br />
      <div className="flex gap-2">
        <button className="bg-green-600 text-white px-4 py-2" onClick={(e)=>submit(e,false)}>
          Generar PDF
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 disabled:bg-blue-300"
          disabled={!email}
          onClick={(e)=>submit(e,true)}
        >
          Generar y Enviar
        </button>
      </div>
    </form>
  );
}
