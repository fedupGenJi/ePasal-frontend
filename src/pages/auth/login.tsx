import '../../index.css';
import { useNotification } from '../../multishareCodes/notificationProvider';
import { useState, useRef } from 'react';
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import demoLogo from '../../assets/demologo.avif'
import Background from '../../multishareCodes/background';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../../config';

const Login = () => {
  const navigate = useNavigate();
  const [gmail, setGmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [forgotDialogOpen, setForgotDialogOpen] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { showNotification } = useNotification();

  const isEmpty = (val: string) => val.trim() === '';
  const isDisabled = isEmpty(gmail) || isEmpty(password);

  const handleMouseEnter = () => {
    if (isDisabled) {
      hoverTimerRef.current = setTimeout(() => {
        setHovered(true);
      }, 5000);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setHovered(false);
  };

  const sendLoginData = async (
    gmail: string,
    password: string,
    navigate: (path: string, options?: any) => void
  ) => {
    const payload = { gmail, password };

    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.text();
        showNotification(`Login failed: ${error}`, 'error');
        return;
      }

      const result = await response.json();
      const userId = result.user_id;
      const status = result.status;

      showNotification('Login successful!', 'success');

      setTimeout(async () => {
        const userInfoResponse = await fetch(`${BACKEND_URL}/user/${userId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!userInfoResponse.ok) {
          const error = await userInfoResponse.text();
          showNotification(`Failed to retrieve user info: ${error}`, 'error');
          return;
        }

        await fetchAndStoreUserInfo(userId);

        if (status === 'admin') {
          navigate('/adminhomepage');
        } else {
          navigate('/');
        }
      }, 3000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        showNotification(`Login failed: ${error.message}`, 'error');
      } else {
        showNotification(`Error while logging in: ${String(error)}`, 'error');
      }
    }
  };

  const fetchAndStoreUserInfo = async (userId: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/user/${userId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorText = await response.text();
        showNotification(`Failed to fetch user info: ${errorText}`, 'error');
        return;
      }

      const userData = await response.json();

      sessionStorage.setItem("userId", userData.user_id);
      sessionStorage.setItem("name", userData.name);
      sessionStorage.setItem("email", userData.email);
      sessionStorage.setItem("phone", userData.phonenumber);
    } catch (error: unknown) {
      showNotification(`Error fetching user data: ${error instanceof Error ? error.message : String(error)}`, 'error');
    }
  };

  const openForgotDialog = () => setForgotDialogOpen(true);
  const closeForgotDialog = () => setForgotDialogOpen(false);

  return (
    <Background>
      <div className="flex justify-start items-start w-screen h-screen p-32">
        <div className="flex flex-col items-start w-[26rem]">

          <div className="flex items-center gap-6 mb-36">
            <img
              src={demoLogo}
              alt="Logo"
              className="w-16 h-16 object-contain"
            />
            <h1 className="text-5xl font-bold text-white font-pacifico">
              ePasal
            </h1>
          </div>

          <h2 className="text-3xl text-white font-pacifico mb-6">Welcome Back!</h2>

          <div className="flex flex-col gap-6 w-full">

            <div className="flex flex-col gap-1 w-full">
              <label className="text-lg text-gray-300 font-quicksand">Gmail</label>
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <EnvelopeIcon className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  value={gmail}
                  onChange={(e) => setGmail(e.target.value)}
                  className="w-full pl-10 p-2 rounded-md border-2 border-gray-700 bg-gray-800 text-white outline-none focus:border-cyan-400 focus:bg-gray-700"
                  placeholder="Enter Gmail"
                />
              </div>
              <div className="min-h-[1.5rem]">
                {hovered && isEmpty(gmail) && (
                  <div className="flex items-center text-sm text-yellow-400 gap-1">
                    <ExclamationCircleIcon className="w-4 h-4" />
                    <span>This field is required</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-lg text-gray-300 font-quicksand">Password</label>
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <LockClosedIcon className="w-5 h-5" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 p-2 rounded-md border-2 border-gray-700 bg-gray-800 text-white outline-none focus:border-cyan-400 focus:bg-gray-700"
                  placeholder="Enter Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-cyan-400"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="min-h-[1.5rem]">
                {hovered && isEmpty(password) && (
                  <div className="flex items-center text-sm text-yellow-400 gap-1">
                    <ExclamationCircleIcon className="w-4 h-4" />
                    <span>This field is required</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end w-full">
              <button
                type="button"
                onClick={openForgotDialog}
                className="text-sm text-blue-400 hover:underline font-quicksand"
              >
                Forgot Password?
              </button>
            </div>

            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="w-full">
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => sendLoginData(gmail, password, navigate)}
                className={`w-full py-2 text-2xl rounded-md transition text-white font-quicksand
              ${isDisabled ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                Login
              </button>
            </div>

            <p className="font-semibold text-gray-300 font-quicksand">
              Don&apos;t have an account?{' '}
              <a href="/signup" className="text-blue-400 hover:underline">
                Register
              </a>
            </p>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-4 w-full py-2 text-lg rounded-md text-white hover:bg-slate-600 font-quicksand text-left"
            >
              Go to Homepage
            </button>
          </div>

          {forgotDialogOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
              onClick={closeForgotDialog}
            >
              <div
                className="bg-white rounded-lg p-6 w-80 max-w-full shadow-lg"
                onClick={(e) => e.stopPropagation()}
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
        </div>
      </div>
    </Background>
  );
};

export default Login;