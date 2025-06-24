import '../../index.css';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  UserIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import demoLogo from '../../assets/demologo.avif';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../../config';

const Login = () => {
  const navigate = useNavigate();
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

  const sendLoginData = async (gmail: string, password: string, navigate: (path: string, options?: any) => void) => {
    const payload = { gmail, password };
  
    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const error = await response.text();
        toast.error(`Login failed: ${error}`, {
          position: "top-center",
          autoClose: 5000,
        });
        return;
      }
  
      const result = await response.json();
      toast.success('Login successful!', {
        position: "top-center",
        autoClose: 3000,
        onClose: () => {
          navigate('/', { state: { userId: result.userId } });
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error while logging in: ${error.message}`, {
          position: "top-center",
          autoClose: 5000,
        });
      } else {
        toast.error(`Error while logging in: ${String(error)}`, {
          position: "top-center",
          autoClose: 5000,
        });
      }
    }
  };

  const openForgotDialog = () => setForgotDialogOpen(true);
  const closeForgotDialog = () => setForgotDialogOpen(false);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-100 font-mono relative px-4">
      <div className="absolute top-8 flex items-center gap-4 px-2">
        <img src={demoLogo} alt="Logo" className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
        <span className="text-2xl sm:text-3xl font-bold text-gray-800">ePasal</span>
      </div>

      <div className="shadow-2xl mt-20 w-full max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center text-center p-6 sm:p-10 gap-6 bg-white rounded-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">Welcome</h1>

          <FormField
            label="Username"
            value={username}
            onChange={setUsername}
            placeholder="Enter username"
            icon={<UserIcon className="w-5 h-5 text-gray-400" />}
            showError={hovered && isEmpty(username)}
            error="This field is required"
          />

          <FormField
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="Enter password"
            icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
            type={showPassword ? 'text' : 'password'}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-cyan-500"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            }
            showError={hovered && isEmpty(password)}
            error="This field is required"
          />

          <div className="w-full text-right">
            <button
              type="button"
              onClick={openForgotDialog}
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="w-full">
            <button
              type="button"
              disabled={isDisabled}
              onClick={() => sendLoginData(username, password, navigate)}
              className={`w-full py-2 mt-4 text-2xl sm:text-3xl rounded-md transition text-white ${
                isDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Login
            </button>
          </div>

          <p className="font-semibold text-sm sm:text-base">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-400 hover:underline">
              Register
            </a>
          </p>
          <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="mt-4 w-full py-2 text-lg rounded-md text-black hover:bg-slate-600 font-quicksand text-left"
                >
                  Go to Homepage
          </button>
        </div>
      </div>

      {forgotDialogOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4"
          onClick={closeForgotDialog}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg"
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
    </section>
  );
};

const FormField = ({
  label,
  value,
  onChange,
  placeholder,
  icon,
  rightIcon,
  type = 'text',
  showError = false,
  error = ''
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  rightIcon?: React.ReactNode;
  type?: string;
  showError?: boolean;
  error?: string;
}) => (
  <div className="text-left w-full relative">
    <label className="text-lg block mb-1">{label}</label>
    <div className="relative">
      <div className="absolute top-1/2 left-3 -translate-y-1/2">{icon}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-2 pl-10 pr-10 rounded-md border-2 border-gray-200 outline-none focus:border-cyan-400 focus:bg-slate-50"
      />
      {rightIcon && <div className="absolute top-1/2 right-3 -translate-y-1/2">{rightIcon}</div>}
    </div>
    <div className="min-h-[1.25rem] mt-1">
      {showError && (
        <div className="flex items-center gap-1 text-xs text-yellow-600">
          <ExclamationCircleIcon className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  </div>
);

export default Login;