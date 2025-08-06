import React, { useEffect, useState } from 'react';
import AdminLayout from './adminLayout';
import { BACKEND_URL } from '../config';

interface LaptopSummary {
  id: number;
  brand_name: string;
  model_name: string;
  face_image_url: string | null;
  total_quantity_sold: number;
  total_revenue: string;
}

const AdminPage: React.FC = () => {
  const [data, setData] = useState<LaptopSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/admin/dashboard`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <AdminLayout pageName="Dashboard">
        <p>Loading...</p>
      </AdminLayout>
    );
  if (error)
    return (
      <AdminLayout pageName="Dashboard">
        <p>Error: {error}</p>
      </AdminLayout>
    );

  return (
    <AdminLayout pageName="Dashboard">
      <h2>Top Selling Laptops</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {data.map((laptop) => (
          <div
            key={laptop.id}
            style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: 8, width: 250 }}
          >
            {laptop.face_image_url && (
              <img
                src={laptop.face_image_url}
                alt={`${laptop.brand_name} ${laptop.model_name}`}
                className="w-16 h-16 rounded-md object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.dataset.fallbackTried) {
                    target.dataset.fallbackTried = 'true';
                    target.src = `${BACKEND_URL}/${laptop.face_image_url}`;
                  } else {
                    target.src = 'https://http.cat/404';
                  }
                }}
                style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8 }}
              />
            )}
            <h3>{laptop.brand_name} {laptop.model_name}</h3>
            <p>Total Sold: {laptop.total_quantity_sold}</p>
            <p>Total Revenue: Rs.{parseFloat(laptop.total_revenue).toFixed(2)}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminPage;