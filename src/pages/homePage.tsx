import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../multishareCodes/navbar';
import { MdEmail, MdPhone } from "react-icons/md";
import esewaLogo from '../assets/esewa.webp';
import khaltiLogo from '../assets/khalti.svg';
import fonepayLogo from '../assets/fonepay.jpg';
import visaLogo from '../assets/visa.svg';
import codLogo from '../assets/cod.svg';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const session = sessionStorage.getItem('user');
    setIsLoggedIn(!!session);
  }, []);

   return (
    <>
      <Navbar />
      <div className="min-h-screen flex justify-center items-center pt-[72px]">
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

      <footer className="bg-black text-white px-10 py-12 text-[15px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10">
          <div>
            <h2 className="text-xl font-bold mb-8"> EPASAL</h2>
            <p className="font-semibold">Support</p>
            <div className="cursor-pointer flex items-center gap-2 mt-2">
              <MdEmail />
              <span>epasal@123.com</span>
            </div>
            <div className="cursor-pointer flex items-center gap-2 mt-1">
              <MdPhone />
              <span>9865202415</span>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-3">Categories</h3>
            <ul className="space-y-1">
              <li className="cursor-pointer">Gaming</li> 
              <li className="cursor-pointer">Laptops</li> 
              <li className="cursor-pointer">Monitors</li> 
              <li className="cursor-pointer">Accessories</li> 
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3">About</h3>
            <ul className="cursor-pointer space-y-1">
              <li className="cursor-pointer">About EPASAL</li> 
              <li className="cursor-pointer">Terms and Conditions</li> 
              <li className="cursor-pointer">Warranty</li> 
              <li className="cursor-pointer">Blog</li> 
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3">Top Brands</h3>
            <ul className="cursor-pointer space-y-1">
              <li className="cursor-pointer">Acer</li> 
              <li className="cursor-pointer">Apple</li> 
              <li className="cursor-pointer">DELL</li> 
              <li className="cursor-pointer">MSI</li> 
              <li className="cursor-pointer">ASUS</li> 
              <li className="cursor-pointer">Microsoft</li> 
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3">Customer Service</h3>
            <ul className="cursor-pointer space-y-1">
              <li className="cursor-pointer">Return and Refund</li> 
              <li className="cursor-pointer">My Account</li> 
              <li className="cursor-pointer">Contact Us</li>  
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
            <h3 className="font-semibold text-lg mb-4 whitespace-nowrap">Payment Methods:</h3>
            <img src={esewaLogo} alt="eSewa" className="h-9 align-middle -mt-3 rounded-[4px]"/>
            <img src={khaltiLogo} alt="khalti" className="h-9 w-20 align-middle -mt-3 "/>
            <img src={fonepayLogo} alt="fonepay" className="h-9 w-19 align-middle -mt-3 rounded-[4px]"/>
            <img src={visaLogo} alt="visa/mastercard" className="h-9 align-middle -mt-3 rounded-sm"/>
            <img src={codLogo} alt="COD" className="h-9 align-middle -mt-3 rounded-sm"/>
          </div>
          <div className="border-t border-gray-700 pt-6 text-white space-y-4 text-center">
            <p>
              At ePasal, we believe buying a laptop should be simple, secure, and stress-free. That’s why we’ve 
              built an online store that brings together top laptop brands, fair prices, and a shopping experience 
              designed around you. Whether you’re a student starting your academic journey, a professional upgrading 
              your workspace, a gamer chasing performance, or just looking for something reliable for everyday use, 
                              ePasal has the right device for your needs.
            </p>
            <p>
              We offer only 100% genuine products with clear specifications and honest pricing, no hidden costs or 
              confusing terms. From budget-friendly models to high-end machines, there's something for everyone. Our
              platform is built to help you browse, compare, and choose easily. We also provide secure payment options 
              and smooth checkout. And yes, we deliver quickly, right to your doorstep.
            </p>
            <p>
              Thousands of customers across Nepal already trust ePasal for their tech needs. We’re here to support you 
              before and after your purchase. Your satisfaction means everything to us.<br />
               <em className="italic">Discover the smart way to shop only at ePasal.</em>
            </p>

          </div>


          <div className="mt-10 border-t border-gray-700 pt-4 text-center text-xs text-gray-400">
            EPASAL Pvt Limited. © {new Date().getFullYear()}. All Rights Reserved.
          </div>
          </div>
      </footer>
    </>
  );
};

export default Home;
