import { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import Navbar from '../multishareCodes/navbar';
import Footer from '../multishareCodes/footer';
import Ads from '../multishareCodes/ads';
import { BACKEND_URL } from '../config';
import axios from 'axios';

type Laptop = {
  id: string;
  image: string;
  display_name: string;
  show_price: string;
  tag: string;
};

const BrandPage = () => {
  const { brand } = useParams<{ brand: string }>();
  const [user_id, set_user_id] = useState<string | null>(null);
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const session = sessionStorage.getItem('userId');
    set_user_id(session);
  }, []);

  const is_logged_in = !!user_id;

  // Define valid brands and their corresponding page names
  const validBrands: Record<string, string> = {
    'acer': 'acer',
    'asus': 'asus',
    'lenovo': 'lenevo',
    'msi': 'msi'
  };

  // Check if the brand is valid
  if (!brand || !validBrands[brand.toLowerCase()]) {
    return <Navigate to="/" replace />;
  }

  const pageName = validBrands[brand.toLowerCase()];

  useEffect(() => {
    const fetchLaptops = async () => {
      setLoading(true);
      setLaptops([]); // clear previous results

      const pageName = validBrands[brand?.toLowerCase() || ''];
      if (!pageName) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BACKEND_URL}/api/brand/${pageName}`);
        setLaptops(response.data.slice(0, 12));
      } catch (err) {
        console.error('Failed to fetch laptops:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLaptops();
  }, [brand]);


  return (
    <>
      <Navbar isLoggedIn={is_logged_in} />
      <Ads pageName={pageName} />
      <div className="my-6 max-w-7xl mx-auto px-4">
        {loading ? (
          <p className="text-center text-gray-600">Loading laptops...</p>
        ) : laptops.length === 0 ? (
          <p className="text-center text-gray-600">No laptops found for this brand.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {laptops.map((laptop) => (
              <div
                key={laptop.id}
                onClick={() => {
                  if (user_id) {
                    const previous = sessionStorage.getItem('viewedLaptopIds');
                    let viewedIds = previous ? JSON.parse(previous) : [];

                    if (!viewedIds.includes(laptop.id)) {
                      viewedIds.push(laptop.id);
                      sessionStorage.setItem('viewedLaptopIds', JSON.stringify(viewedIds));
                    }
                  }
                  navigate(`/product-page?id=${laptop.id}`)
                }}
                className="top-pick-box border rounded-lg shadow p-4 transition"
              >
                {laptop.tag && (
                  <div className="ribbon">
                    <span>{laptop.tag}</span>
                  </div>
                )}
                <div className="image-container">
                  <img
                    src={laptop.image}
                    alt={laptop.display_name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.dataset.fallbackTried) {
                        target.dataset.fallbackTried = 'true';
                        target.src = `${BACKEND_URL}/${laptop.image}`;
                      } else if (!target.dataset.secondFallbackTried) {
                        target.dataset.secondFallbackTried = 'true';
                        target.src = 'https://http.cat/404';
                      }
                    }}
                  />
                </div>
                <div className="info">
                  <h3 className="display-name">{laptop.display_name}</h3>
                  <p className="text-sm text-gray-500">{laptop.tag}</p>
                  <p className="price">{laptop.show_price}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
      <div style={{ height: '40px' }} />
      <Footer />
    </>
  );
};

export default BrandPage; 