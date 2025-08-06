import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'

import Home from './pages/homePage';

import BrandPage from './pages/brandPage';

import Shop from './pages/shop';

import AdminPage from './admin/adminPage'
import ProductPage from './pages/product page/Page'
import AddProduct from './admin/addproduct'
import Inventory from './admin/inventory'
import CustomerSupport from './admin/customers';

import Conversation from './pages/conversation'
import PaymentPage from './pages/paymentPage';

// Laptop versions
import LoginLaptop from './pages/auth/login';
import SignupLaptop from './pages/auth/signup';
import OtpLaptop from './pages/auth/otp';

// Other devices
import Login from './pages/auth/loginPage';
import Signup from './pages/auth/signupPage';
import Otp from './pages/auth/otpPage'


function App() {
  // Detect laptop by checking user agent does NOT include "Mobi" or "Android"
  const isLaptop = !/Mobi|Android/i.test(navigator.userAgent);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/shop" element={<Shop/>}/>

        <Route path="/product-page" element={<ProductPage />} />

        <Route
          path="/login"
          element={isLaptop ? <LoginLaptop /> : <Login />}
        />
        <Route
          path="/signup"
          element={isLaptop ? <SignupLaptop /> : <Signup />}
        />

        <Route
          path="/otp"
          element={isLaptop ? <OtpLaptop /> : <Otp />}
        />
        <Route path="/adminhomepage" element={<AdminPage />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/inventory" element={<Inventory/>} />
        <Route path="/support" element={<CustomerSupport/>} />
        <Route path="/conversation" element={<Conversation/>} />
        <Route path="/:brand" element={<BrandPage />} />
        <Route path="/payment/status" element={<PaymentPage />} />
      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        toastClassName={(context) => {
          const type = context?.type ?? 'default';
          return `react-toastify__toast react-toastify__toast--${type} react-toastify__toast-theme--colored w-auto max-w-none whitespace-pre-wrap break-words p-4`;
        }}
      />

    </>
  );
}

export default App;