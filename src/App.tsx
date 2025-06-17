import { Routes, Route } from 'react-router-dom';
import Home from './pages/homePage';
import Login from './pages/login';
import Signup from './pages/signup';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;