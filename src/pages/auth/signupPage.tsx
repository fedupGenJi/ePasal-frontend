import '../../index.css';
import { useState, useRef } from 'react';
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import demoLogo from '../../assets/demologo.avif';
import { BACKEND_URL } from '../../config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hovered, setHovered] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isEmpty = (val: string) => val.trim() === '';
  const isEmailValid = (val: string) => val.trim().endsWith('@gmail.com');
  const isPhoneValid = (val: string) => /^\d{10}$/.test(val);
  const isPasswordStrong = (val: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(val);
  const doPasswordsMatch = password === confirmPassword;

  const isDisabled =
    isEmpty(name) ||
    !isPhoneValid(number) ||
    !isEmailValid(email) ||
    !isPasswordStrong(password) ||
    !doPasswordsMatch;

  const handleMouseEnter = () => {
    if (isDisabled) {
      hoverTimerRef.current = setTimeout(() => {
        setHovered(true);
      }, 3000);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setHovered(false);
  };

  const sendSignupData = async () => {
    const payload = { name, number, email, password };
  
    try {
      const response = await fetch(`${BACKEND_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const error = await response.text();
        toast.error(`Signup failed: ${error}`, {
          position: "top-center",
          autoClose: 5000,
        });
        return;
      }
  
      const result = await response.json();
      toast.success('Signup successful! Sending OTP...', {
        position: "top-center",
        autoClose: 3000,
        onClose: () => {
          navigate('/otp', { state: { temp_id: result.temp_id, otp: result.otp } });
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error while signing up: ${error.message}`, {
          position: "top-center",
          autoClose: 5000,
        });
      } else {
        toast.error(`Error while signing up: ${String(error)}`, {
          position: "top-center",
          autoClose: 5000,
        });
      }
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-100 font-mono relative px-4">
      <div className="absolute top-8 flex items-center gap-4 px-2">
        <img src={demoLogo} alt="Logo" className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
        <span className="text-2xl sm:text-3xl font-bold text-gray-800">ePasal</span>
      </div>

      <div className="shadow-2xl mt-20 w-full max-w-md mx-auto">
        <div className="flex flex-col items-center text-center p-6 sm:p-10 gap-6 bg-white rounded-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-2">Register</h1>

          <div className="w-full space-y-4">
            <FormField
              label="Name"
              value={name}
              onChange={setName}
              placeholder="Enter your name"
              icon={<UserIcon className="w-5 h-5 text-gray-400" />}
              showError={hovered && isEmpty(name)}
              error="Name is required"
            />

            <FormField
              label="Phone Number"
              value={number}
              onChange={setNumber}
              placeholder="10-digit number"
              icon={<PhoneIcon className="w-5 h-5 text-gray-400" />}
              showError={hovered && !isPhoneValid(number)}
              error="Valid phoneNo is required"
            />

            <FormField
              label="Email"
              value={email}
              onChange={setEmail}
              placeholder="example@gmail.com"
              icon={<EnvelopeIcon className="w-5 h-5 text-gray-400" />}
              showError={hovered && !isEmailValid(email)}
              error="Valid email ending with @gmail.com required"
            />

            <FormField
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="Set strong password"
              icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
              type={showPassword ? 'text' : 'password'}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-cyan-500"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              }
              showError={hovered && !isPasswordStrong(password)}
              error="Min 8 chars, upper, lower, number & symbol"
            />

            <FormField
              label="Confirm Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Re-enter password"
              icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
              type={showPassword ? 'text' : 'password'}
              showError={hovered && !doPasswordsMatch}
              error="Passwords do not match"
            />
          </div>

          <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="w-full">
            <button
              type="button"
              disabled={isDisabled}
              onClick={sendSignupData}
              className={`w-full py-2 mt-4 text-xl sm:text-2xl rounded-md transition text-white ${
                isDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          <p className="font-semibold text-sm sm:text-base">
            Already have an account?{' '}
            <a href="/login" className="text-blue-400 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
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
        className="w-full p-2 pl-10 pr-10 rounded-md border-2 border-gray-200 outline-none focus:border-cyan-400"
      />
      {rightIcon && <div className="absolute top-1/2 right-3 -translate-y-1/2">{rightIcon}</div>}
    </div>
    <div className="min-h-[1.25rem] mt-1">
      {showError && <ValidationMessage message={error} />}
    </div>
  </div>
);

const ValidationMessage = ({ message }: { message: string }) => (
  <div className="flex items-center gap-1 text-xs text-yellow-600">
    <ExclamationCircleIcon className="w-4 h-4" />
    <span>{message}</span>
  </div>
);

export default Signup;