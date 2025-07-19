import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../multishareCodes/navbar';
import Footer from '../multishareCodes/footer';

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

      <Footer />
    </>
  );
};

export default Home;