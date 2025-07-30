import { useEffect, useState } from 'react';
import Navbar from '../multishareCodes/navbar';
import Footer from '../multishareCodes/footer';
import Ads from '../multishareCodes/ads';

const AsusPage = () => {
  const [user_id, set_user_id] = useState<string | null>(null);

  useEffect(() => {
    const session = sessionStorage.getItem('userId');
    set_user_id(session);
  }, []);

  const is_logged_in = !!user_id;

  return (
    <>
      <Navbar isLoggedIn={is_logged_in} />
      <Ads pageName="asus" />
      <div style={{ height: '40px' }} />
      <Footer />
    </>
  );
};

export default AsusPage; 