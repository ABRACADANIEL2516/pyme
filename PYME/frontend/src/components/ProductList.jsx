import { useEffect, useState } from 'react';
import api from '../api';

export default function ProductList({ refresh }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products').then((res) => setProducts(res.data));
  }, [refresh]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Productos</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Precio</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="border p-1 text-center">{p.id}</td>
              <td className="border p-1">{p.name}</td>
              <td className="border p-1 text-right">${p.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
