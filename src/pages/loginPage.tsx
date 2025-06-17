import '../index.css';
import { useState, useRef } from 'react';
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import demoLogo from '../assets/demologo.avif'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [forgotDialogOpen, setForgotDialogOpen] = useState(false); 
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isEmpty = (val: string) => val.trim() === '';
  const isDisabled = isEmpty(username) || isEmpty(password);

  const handleMouseEnter = () => {
    if (isDisabled) {
      hoverTimerRef.current = setTimeout(() => {
        setHovered(true);
      }, 5000);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    setHovered(false);
  };

  const openForgotDialog = () => setForgotDialogOpen(true);
  const closeForgotDialog = () => setForgotDialogOpen(false);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-100 font-mono relative">
      
      <div className="absolute top-8 flex items-center gap-4">
        <img src={demoLogo} alt="Logo" className="h-12 w-12 object-contain" />
        <span className="text-3xl font-bold text-gray-800">ePasal</span>
      </div>

      <div className="shadow-2xl mt-20">
        <div className="flex flex-col items-center justify-center text-center p-10 gap-6 bg-white rounded-2xl w-[28rem] relative">

          <h1 className="text-5xl font-bold mb-2">Welcome</h1>

          <div className="w-full text-left relative">
            <label className="text-lg">Username</label>
            <div className="relative">
              <UserIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 pl-10 rounded-md border-2 border-gray-200 outline-none focus:border-cyan-400 focus:bg-slate-50"
                placeholder="Enter username"
              />
            </div>
            <div className="min-h-[1.25rem] mt-1">
              {hovered && isEmpty(username) && (
                <div className="flex items-center text-sm text-yellow-600 gap-1">
                  <ExclamationCircleIcon className="w-4 h-4" />
                  <span>This field is required</span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full text-left relative">
            <label className="text-lg">Password</label>
            <div className="relative">
              <LockClosedIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 pl-10 pr-10 rounded-md border-2 border-gray-200 outline-none focus:border-cyan-400 focus:bg-slate-50"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-cyan-500"
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            <div className="min-h-[1.25rem] mt-1">
              {hovered && isEmpty(password) && (
                <div className="flex items-center text-sm text-yellow-600 gap-1">
                  <ExclamationCircleIcon className="w-4 h-4" />
                  <span>This field is required</span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full text-right">
            <button
              type="button"
              onClick={openForgotDialog}
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="w-full"
          >
            <button
              type="button"
              disabled={isDisabled}
              className={`w-full py-2 mt-4 text-2xl rounded-md transition text-white 
                ${isDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Login
            </button>
          </div>

          <p className="font-semibold">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-400 hover:underline">Register</a>
          </p>
        </div>
      </div>

      {forgotDialogOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={closeForgotDialog}
        >
          <div
            className="bg-white rounded-lg p-6 w-80 max-w-full shadow-lg"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
            <p className="mb-6">Go and cry about it for now.</p>
            <button
              onClick={closeForgotDialog}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Login;