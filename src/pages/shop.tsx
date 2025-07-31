import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../multishareCodes/navbar';
import Footer from '../multishareCodes/footer';
const Shop = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const [minPrice, setMinPrice] = useState(50000);
  const [maxPrice, setMaxPrice] = useState(250000);

  useEffect(() => {
    const session = sessionStorage.getItem('userId');
    setUserId(session);
  }, []);

  const isLoggedIn = !!userId;

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />

      <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
        <div
          style={{
            width: '30%',
            borderRight: '1px solid #ccc',
            padding: '20px',
            position: 'sticky',
            top: '120px',
            bottom: 0,
            left: 0,
            backgroundColor: '#f7f7f7',
            overflowY: 'hidden',
          }}
        >
          <h2>Filters</h2>

          <div style={{ marginBottom: '20px' }}>
            <label><strong>Brand:</strong></label><br />
            <input type="checkbox" id="lenevo" />
            <label htmlFor="lenevo"> Lenevo</label><br />
            <input type="checkbox" id="msi" />
            <label htmlFor="msi"> MSI</label><br />
            <input type="checkbox" id="acer" />
            <label htmlFor="acer"> Acer</label><br />
            <input type="checkbox" id="asus" />
            <label htmlFor="asus"> ASUS</label>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label><strong>Price Range (Rs.):</strong></label>
            <div style={{ marginTop: '10px' }}>
              <div>
                <label>Min: ₹{minPrice.toLocaleString()}</label>
                <input
                  type="range"
                  min="50000"
                  max={maxPrice}
                  step="5000"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ marginTop: '10px' }}>
                <label>Max: ₹{maxPrice.toLocaleString()}</label>
                <input
                  type="range"
                  min={minPrice}
                  max="400000"
                  step="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            <p style={{ marginTop: '10px' }}>
              <strong>Selected Range:</strong> Rs.{minPrice.toLocaleString()} - Rs.{maxPrice.toLocaleString()}
            </p>
          </div>

        </div>

        <div style={{ marginLeft: '30%', padding: '20px', width: '70%' }}>
          <h1>Shop Items</h1>
          {/* Add product grid or list here */}
        </div>
      </div>

      <Footer/>
    </>
  );
};

export default Shop;