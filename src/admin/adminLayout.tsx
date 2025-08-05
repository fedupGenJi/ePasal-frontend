import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface AdminLayoutProps {
  pageName: string;
  children: React.ReactNode;
}

const menuItems = [
  { name: 'Dashboard', path: '/adminhomepage' },
  { name: 'Add Product', path: '/addproduct' },
  { name: 'Inventory', path: '/inventory' },
  { name: 'Customer Support', path: '/support' },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ pageName, children }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; phone: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const name = sessionStorage.getItem('name');
    const email = sessionStorage.getItem('email');
    const phone = sessionStorage.getItem('phone');
    if (name && email && phone) {
      setUser({ name, email, phone });
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setUser(null);
    setShowDropdown(false);
    navigate('/login');
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setShowDropdown(false);
    }
  };

  return (
    <>
      <div
        style={{
          height: '80px',
          backgroundColor: '#222',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 2rem',
          fontSize: '1.4rem',
          fontWeight: 'bold',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        }}
      >
        <div>E-Pasal Admin Portal</div>
        {user && (
          <div
            onClick={() => setShowDropdown(true)}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: '#444',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: '1.2rem',
              transition: 'background 0.3s',
            }}
            title="Profile"
          >
            👤
          </div>
        )}
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
        <div
          style={{
            width: '220px',
            backgroundColor: '#111',
            color: '#fff',
            paddingTop: '2rem',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '2px 0 8px rgba(0,0,0,0.2)',
          }}
        >
          {menuItems.map((item) => (
            <div
              key={item.name}
              onClick={() => navigate(item.path)}
              style={{
                padding: '1rem 1.5rem',
                backgroundColor:
                  location.pathname === item.path ? '#333' : 'transparent',
                cursor: 'pointer',
                fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                borderLeft:
                  location.pathname === item.path ? '4px solid orange' : '4px solid transparent',
                transition: '0.2s',
              }}
            >
              {item.name}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, padding: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{pageName}</h1>
          {children}
        </div>
      </div>

      {showDropdown && (
        <div
          onClick={handleOverlayClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
            padding: '1rem',
          }}
        >
          <div
            ref={dropdownRef}
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              padding: '1.5rem',
              minWidth: '280px',
              marginTop: '90px',
              animation: 'fadeIn 0.3s ease-out',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}
          >
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Phone:</strong> {user?.phone}</p>
            <button
              onClick={handleLogout}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#111',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
};

export default AdminLayout;