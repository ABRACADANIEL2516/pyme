import { useState } from 'react';
import api from '../api';

export default function ProductForm({ onSuccess }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', { name, price: parseFloat(price) });
      setName('');
      setPrice('');
      onSuccess?.();
      alert('Producto agregado');
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  return (
    <form onSubmit={submit} className="mb-4 space-y-2">
      <h2 className="text-xl font-semibold">Agregar Producto</h2>
      <input
        className="border p-2 w-full"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        className="border p-2 w-full"
        placeholder="Precio"
        type="number"
        step="0.01"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <button className="bg-blue-600 text-white px-4 py-2" type="submit">
        Guardar
      </button>
    </form>
  );
}
