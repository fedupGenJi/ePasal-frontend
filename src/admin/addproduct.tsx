import React from 'react';
import AdminLayout from './adminLayout';

const ProductPage: React.FC = () => {
  return (
    <AdminLayout pageName="addproduct">
      <p>Welcome to your admin dashboard!</p>
    </AdminLayout>
  );
};

export default ProductPage;