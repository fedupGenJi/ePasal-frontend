import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../multishareCodes/navbar';
import Footer from '../multishareCodes/footer';
import './shop.css';
import { BACKEND_URL } from '../config';

const Shop = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  const [minPrice, setMinPrice] = useState(50000);
  const [maxPrice, setMaxPrice] = useState(250000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [filterExists, setFilterExists] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<{
    id: string;
    image: string;
    display_name: string;
    show_price: string;
    tag: string;
  }[]>([]);

  const [searchSuggestions, setSearchSuggestions] = useState<typeof searchResults>([]);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const [displayFilter, setDisplayFilter] = useState<{
    brands: string[];
    minPrice: number;
    maxPrice: number;
  } | null>(null);

  const [viewedIds, setViewedIds] = useState<string[]>([]);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const session = sessionStorage.getItem('userId');
    setUserId(session);

    const savedViewedIds = sessionStorage.getItem('viewedLaptopIds');
    if (savedViewedIds) {
      setViewedIds(JSON.parse(savedViewedIds));
    } else {
      setViewedIds([]);
    }

    const savedFilter = sessionStorage.getItem('shopFilters');
    if (savedFilter) {
      const parsed = JSON.parse(savedFilter);
      setSelectedBrands(parsed.brands);
      setMinPrice(parsed.minPrice);
      setMaxPrice(parsed.maxPrice);
      setFilterExists(true);
      setDisplayFilter(parsed);
    } else {
      setDisplayFilter(null);
    }

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      fetchProducts();
    }
  }, [isInitialized, userId, viewedIds, filterExists]);

  const fetchProducts = async (term: string = '') => {
    try {
      const queryParams = new URLSearchParams();

      if (term.trim()) queryParams.append('search', term);

      if (filterExists) {
        const stored = sessionStorage.getItem('shopFilters');
        if (stored) {
          const { brands, minPrice, maxPrice } = JSON.parse(stored);

          if (brands && brands.length > 0) {
            queryParams.append('brands', brands.join(','));
          }

          if (minPrice !== undefined && minPrice !== null) {
            queryParams.append('min_price', minPrice.toString());
          }

          if (maxPrice !== undefined && maxPrice !== null) {
            queryParams.append('max_price', maxPrice.toString());
          }
        }
      }

      if (viewedIds.length > 0) {
        queryParams.append('viewed', viewedIds.join(','));
      }

      if (!userId || viewedIds.length === 0) {
        queryParams.append('random', 'true');
      }

      const fullURL = `${BACKEND_URL}/api/productshow/getproduct?${queryParams.toString()}`;
      //console.log("Fetching products with URL:", fullURL);

      const response = await fetch(fullURL);
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(async () => {
      if (searchTerm.trim()) {
        try {
          const queryParams = new URLSearchParams();
          queryParams.append('search', searchTerm);
          const res = await fetch(`${BACKEND_URL}/api/productshow/suggestion?${queryParams}`);
          const data = await res.json();
          setSearchSuggestions(data.slice(0, 5));
        } catch (err) {
          console.error('Suggestion error:', err);
        }
      } else {
        setSearchSuggestions([]);
      }
    }, 300);

    setDebounceTimer(timer);
    return () => clearTimeout(timer);
  }, [searchTerm]);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(searchTerm);
    setSearchSuggestions([]);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    fetchProducts('');
    setSearchSuggestions([]);
  };

  const isLoggedIn = !!userId;
  const brandOptions = ['Lenevo', 'MSI', 'Acer', 'ASUS'];

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
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
                <label>Min: Rs.{minPrice.toLocaleString()}</label>
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
                <label>Max: Rs.{maxPrice.toLocaleString()}</label>
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
              <button onClick={saveOrUpdateFilter} className="filter-button">
                Save Filter
              </button>
            ) : (
              <>
                <button onClick={saveOrUpdateFilter} className="filter-button">
                  Update Filter
                </button>
                <button onClick={clearFilter} className="filter-button danger">
                  Clear Filter
                </button>
              </>
            )}
          </div>
        </div>

        <div style={{ padding: '20px', width: '70%' }}>
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 40px 10px 10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '16px',
              }}
            />
            {searchTerm && (
              <span
                onClick={handleClearSearch}
                style={{
                  position: 'absolute',
                  right: '90px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  color: '#999',
                  zIndex: 10,
                }}
              >
                ✖
              </span>
            )}
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '6px 12px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Search
            </button>

            {searchSuggestions.length > 0 && (
              <ul className="search-suggestions">
                {searchSuggestions.map(item => (
                  <li
                    key={item.id}
                    onClick={() => {
                      setSearchTerm(item.display_name);
                      fetchProducts(item.display_name);
                      setSearchSuggestions([]);
                    }}
                  >
                    {item.image && (
                      <img
                        src={item.image.startsWith('http') ? item.image : `${BACKEND_URL}/${item.image}`}
                        alt={item.display_name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    <span>{item.display_name}</span>
                  </li>
                ))}
              </ul>
            )}
          </form>

          <h1>Shop Items</h1>

          {displayFilter ? (
            <>
              <p><strong>Active Brands:</strong> {displayFilter.brands.join(', ') || 'None'}</p>
              <p>
                <strong>Price Range:</strong> Rs.
                {displayFilter.minPrice.toLocaleString()} - Rs.
                {displayFilter.maxPrice.toLocaleString()}
              </p>
            </>
          ) : (
            <p><em>No filters applied.</em></p>
          )}

          <div style={{ height: '40px' }} />

          {searchResults.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '15px',
              }}
            >
              {searchResults.map((item, index) => {
                const className = `top-pick-box${index % 5 === 0 ? ' left-most' : index % 5 === 4 ? ' right-most' : ''}`;

                return (
                  <div
                    key={`${item.id}-${index}`}
                    className={className}
                    onClick={() => {
                      if (userId) {
                        const previous = sessionStorage.getItem('viewedIds');
                        let viewedIds = previous ? JSON.parse(previous) : [];

                        if (!viewedIds.includes(item.id)) {
                          viewedIds.push(item.id);
                          sessionStorage.setItem('viewedIds', JSON.stringify(viewedIds));
                        }
                      }
                      navigate(`/product-page?id=${item.id}`);
                    }}
                    style={{
                      cursor: 'pointer',
                      width: '100%',
                      border: '1px solid #ccc',
                      borderRadius: '10px',
                      padding: '10px',
                      textAlign: 'center',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                      position: 'relative',
                    }}
                  >
                    {item.tag && (
                      <div className="ribbon">
                        <span>{item.tag}</span>
                      </div>
                    )}

                    <div className="image-container" style={{ height: '150px' }}>
                      <img
                        src={item.image}
                        alt={item.display_name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.dataset.fallbackTried) {
                            target.dataset.fallbackTried = 'true';
                            target.src = `${BACKEND_URL}/${item.image}`;
                          } else if (!target.dataset.secondFallbackTried) {
                            target.dataset.secondFallbackTried = 'true';
                            target.src = 'https://http.cat/404';
                          }
                        }}
                      />
                    </div>

                    <div className="info">
                      <div className="display-name" style={{ margin: '10px 0', fontWeight: 'bold' }}>
                        {item.display_name}
                      </div>
                      <div className="price" style={{ color: '#007bff', fontWeight: 'bold' }}>
                        {item.show_price}
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          ) : (
            <p><em>No matching products found.</em></p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Shop;