import { Routes, Route } from 'react-router-dom';
import Home from './pages/homePage';
import Login from './pages/loginPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;