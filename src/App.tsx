import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/homePage';

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
      />
    </>
  );
}

export default App;