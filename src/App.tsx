import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/homePage';

// Laptop versions
import LoginLaptop from './pages/login';
import SignupLaptop from './pages/signup';

// Other devices
import Login from './pages/loginPage';
import Signup from './pages/signupPage';

import Otp from './pages/otp';

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

      <Route path="/otp" element={<Otp />} />
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