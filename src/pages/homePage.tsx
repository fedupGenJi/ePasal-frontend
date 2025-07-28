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

  useEffect(() => {
    if (top_picks.length <= 5) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + 1 < top_picks.length ? prevIndex + 1 : 0
      );
    }, 3000);

    return () => clearInterval(interval);
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
        <div style={{ textAlign: 'center', marginTop: '20px' }}>Loading...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar isLoggedIn={is_logged_in} />
      <Ads />

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
      <div className="top-picks-wrapper">
        <div className="top-picks-slider">
          {getVisibleItems().map((item, index) => (
            <div key={`${item.id}-${index}`} className="top-pick-box">
              <div className="image-container">
                <img src={item.image} alt={item.display_name} />
              </div>
              <div className="info">
                <div className="display-name">{item.display_name}</div>
                <div className="price">{item.show_price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;