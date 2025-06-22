import { Routes, Route } from 'react-router-dom';
import Home from './pages/homePage';

// Laptop versions
import LoginLaptop from './pages/login';
import SignupLaptop from './pages/signup';

// Other devices
import Login from './pages/loginPage';
import Signup from './pages/signupPage';

function App() {
  // Detect laptop by checking user agent does NOT include "Mobi" or "Android"
  const isLaptop = !/Mobi|Android/i.test(navigator.userAgent);

  return (

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
    </Routes>

  );
}

export default App;