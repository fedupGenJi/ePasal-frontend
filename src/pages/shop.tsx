import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../multishareCodes/navbar';
import Footer from '../multishareCodes/footer';
import './shop.css'

const Shop = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  const [minPrice, setMinPrice] = useState(50000);
  const [maxPrice, setMaxPrice] = useState(250000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [filterExists, setFilterExists] = useState(false);

  // Display values read from sessionStorage for Shop Items info
  const [displayFilter, setDisplayFilter] = useState<{
    brands: string[];
    minPrice: number;
    maxPrice: number;
  } | null>(null);

  useEffect(() => {
    const session = sessionStorage.getItem('userId');
    setUserId(session);

    const savedFilter = sessionStorage.getItem('shopFilters');
    if (savedFilter) {
      const parsed = JSON.parse(savedFilter);
      const { brands, minPrice, maxPrice } = parsed;
      setSelectedBrands(brands);
      setMinPrice(minPrice);
      setMaxPrice(maxPrice);
      setFilterExists(true);
      setDisplayFilter(parsed);
    } else {
      setDisplayFilter(null);
    }
  }, []);

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const saveOrUpdateFilter = () => {
    const filter = {
      brands: selectedBrands,
      minPrice,
      maxPrice,
    };
    sessionStorage.setItem('shopFilters', JSON.stringify(filter));
    window.location.reload();
  };

  const clearFilter = () => {
    sessionStorage.removeItem('shopFilters');
    window.location.reload();
  };

  const isLoggedIn = !!userId;
  const brandOptions = ['Lenevo', 'MSI', 'Acer', 'ASUS'];

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
          <h1
            style={{
              fontWeight: '900',
              letterSpacing: '2px',
              marginBottom: '20px',
            }}
          >
            Filters
          </h1>

          <div style={{ marginBottom: '20px' }}>
            <label><strong>Brand:</strong></label><br />
            {brandOptions.map(brand => (
              <div key={brand}>
                <input
                  type="checkbox"
                  id={brand.toLowerCase()}
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                />
                <label htmlFor={brand.toLowerCase()}> {brand}</label>
              </div>
            ))}
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

          <div style={{ height: '40px' }} />

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {!filterExists ? (
              <button
                onClick={saveOrUpdateFilter}
                className="filter-button"
              >
                Save Filter
              </button>
            ) : (
              <>
                <button
                  onClick={saveOrUpdateFilter}
                  className="filter-button"
                >
                  Update Filter
                </button>
                <button
                  onClick={clearFilter}
                  className="filter-button danger"
                >
                  Clear Filter
                </button>
              </>
            )}
          </div>
        </div>

        <div style={{ padding: '20px', width: '70%' }}>
          <h1>Shop Items</h1>

          {displayFilter ? (
            <>
              <p><strong>Active Brands:</strong> {displayFilter.brands.join(', ') || 'None'}</p>
              <p>
                <strong>Price Range:</strong> ₹
                {displayFilter.minPrice.toLocaleString()} - ₹
                {displayFilter.maxPrice.toLocaleString()}
              </p>
            </>
          ) : (
            <p><em>No filters applied.</em></p>
          )}

          {/* Add your filtered product display here */}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Shop;