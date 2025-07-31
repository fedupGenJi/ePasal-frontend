import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Navbar from '../multishareCodes/navbar';
import Footer from '../multishareCodes/footer';
import Ads from '../multishareCodes/ads';

const BrandPage = () => {
  const { brand } = useParams<{ brand: string }>();
  const [user_id, set_user_id] = useState<string | null>(null);

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

  return (
    <>
      <Navbar isLoggedIn={is_logged_in} />
      <Ads pageName={pageName} />
      <div style={{ height: '40px' }} />
      <Footer />
    </>
  );
};

export default BrandPage; 