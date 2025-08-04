import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../multishareCodes/navbar';
import Footer from '../multishareCodes/footer';
import Ads from '../multishareCodes/ads';
import { BACKEND_URL } from '../config';
import './homePage.css';

type Top_pick_item = {
  id: string;
  image: string;
  display_name: string;
  show_price: string;
  tag: string;
};

const Home = () => {
  const [user_id, set_user_id] = useState<string | null>(null);
  const [top_picks, set_top_picks] = useState<Top_pick_item[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const session = sessionStorage.getItem('userId');
    set_user_id(session);

    const fetch_top_picks = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/top-picks`);
        if (!res.ok) {
          throw new Error('Failed to fetch top picks');
        }
        const data = await res.json();
        set_top_picks(data);
      } catch (err) {
        console.error('Error fetching top picks:', err);
      }
    };

    fetch_top_picks();
  }, []);

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (top_picks.length <= 5) return;

    const id = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + 1 < top_picks.length ? prevIndex + 1 : 0
      );
    }, 3000);

    setIntervalId(id);

    return () => clearInterval(id);
  }, [top_picks]);

  const is_logged_in = !!user_id;

  const getVisibleItems = () => {
    const visible = [];
    for (let i = 0; i < 5; i++) {
      visible.push(top_picks[(currentIndex + i) % top_picks.length]);
    }
    return visible;
  };

  if (top_picks.length === 0) {
    return (
      <>
        <Navbar isLoggedIn={is_logged_in} />
        <Ads />
        <div style={{ height: '40px' }} />
        <div
          style={{
            textAlign: 'center',
            marginTop: '40px',
            fontSize: '2rem',
            fontWeight: 'bold',
          }}
        >
          TOP PICKS
        </div>
        <div style={{ height: '20px' }} />
        <div style={{ textAlign: 'center', marginTop: '20px' }}>Loading...</div>
        <div style={{ height: '20px' }} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar isLoggedIn={is_logged_in} />

      <Ads />
      <div style={{ height: '40px' }} />
      <div
        style={{
          textAlign: 'center',
          marginTop: '40px',
          fontSize: '2rem',
          fontWeight: 'bold',
        }}
      >
        TOP PICKS
      </div>
      <div style={{ height: '20px' }} />
      <div className="top-picks-wrapper">
        <div
          className="top-picks-slider"
          onMouseEnter={() => {
            if (intervalId) clearInterval(intervalId);
          }}
          onMouseLeave={() => {
            if (top_picks.length > 5) {
              const id = setInterval(() => {
                setCurrentIndex((prevIndex) =>
                  prevIndex + 1 < top_picks.length ? prevIndex + 1 : 0
                );
              }, 3000);
              setIntervalId(id);
            }
          }}
        >
          {getVisibleItems().map((item, index) => {
            const className = `top-pick-box${index === 0 ? ' left-most' : index === 4 ? ' right-most' : ''}`;

            return (
              <div
                key={`${item.id}-${index}`}
                className={className}
                onClick={() => navigate(`/product-page?id=${item.id}`)}
                style={{ cursor: 'pointer' }}
              >
                {item.tag && (
                  <div className="ribbon">
                    <span>{item.tag}</span>
                  </div>
                )}
                <div className="image-container">
                  <img
                    src={item.image}
                    alt={item.display_name}
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
                  <div className="display-name">{item.display_name}</div>
                  <div className="price">{item.show_price}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ height: '40px' }} />
      <Footer />
    </>
  );
};

export default Home;