import React from 'react';
import AdminLayout from './adminLayout';

const AdminPage: React.FC = () => {
  return (
    <AdminLayout pageName="Dashboard">
      <p>Welcome to your admin dashboard!</p>
    </AdminLayout>
  );
};

export default AdminPage;