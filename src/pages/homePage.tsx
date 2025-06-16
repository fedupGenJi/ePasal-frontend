import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const session = sessionStorage.getItem('user');
    setIsLoggedIn(!!session);
  }, []);

  return (
        <div className="min-h-screen flex justify-center items-center">
      {isLoggedIn ? (
        <button className="p-2 bg-green-600 text-white rounded-full">👤</button>
      ) : (
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => navigate('/login')}
        >
          Login Now
        </button>
      )}
    </div>
  );
};

export default Home;
