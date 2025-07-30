import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../multishareCodes/navbar';
import Footer from '../multishareCodes/footer';
import Ads from '../multishareCodes/ads';

const Home = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const session = sessionStorage.getItem('userId');
    setUserId(session);
  }, []);
  const isLoggedIn = !!userId;

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn}/>
      {/* Button to navigate to the product page located in pages/product page/ directory */}
      <div className="flex justify-center my-8">
        <button
          onClick={() => navigate('/product-page')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          View Products1
        </button>
      </div>
      <Ads />
      <Footer />
    </>
  );
};

export default Home;