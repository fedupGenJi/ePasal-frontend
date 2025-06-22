import '../index.css';
import { useState, useRef } from 'react';
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import Background from '../multishareCodes/background';
import { BACKEND_URL } from '../config';
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

  const isDisabled = (
    isEmpty(name) ||
    !isPhoneValid(number) ||
    !isEmailValid(email) ||
    !isPasswordStrong(password) ||
    !doPasswordsMatch
  );

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
    <Background>
      <div className="flex justify-start items-start w-screen h-screen pt-16 pl-32 pr-32 pb-32">
        <div className="flex flex-col items-start w-[26rem]">
          <h2 className="text-3xl text-white font-pacifico mb-14">Create an Account</h2>

          <div className="flex flex-col gap-6 w-full">
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
              error="Valid phone number is required"
            />

            <FormField
              label="Email"
              value={email}
              onChange={setEmail}
              placeholder="example@gmail.com"
              icon={<EnvelopeIcon className="w-5 h-5 text-gray-400" />}
              showError={hovered && !isEmailValid(email)}
              error="Email must end with @gmail.com"
            />

            <FormField
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="Set a strong password"
              icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
              type={showPassword ? 'text' : 'password'}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-cyan-400"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              }
              showError={hovered && !isPasswordStrong(password)}
              error="8+ chars, upper/lower, number, symbol"
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

            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="w-full"
            >
              <button
                type="button"
                disabled={isDisabled}
                onClick={sendSignupData}
                className={`w-full py-2 text-2xl rounded-md transition text-white font-quicksand
                ${isDisabled ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                Sign Up
              </button>
            </div>

            <p className="font-semibold text-gray-300 font-quicksand">
              Already have an account?{' '}
              <a href="/login" className="text-blue-400 hover:underline">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </Background>
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
  <div className="text-left w-full relative text-white">
    <label className="text-lg block mb-1 font-quicksand">{label}</label>
    <div className="relative">
      <div className="absolute top-1/2 left-3 -translate-y-1/2">{icon}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-2 pl-10 pr-10 rounded-md border-2 border-gray-700 bg-gray-800 text-white outline-none focus:border-cyan-400 focus:bg-gray-700"
      />
      {rightIcon && <div className="absolute top-1/2 right-3 -translate-y-1/2">{rightIcon}</div>}
    </div>
    <div className="min-h-[1.25rem] mt-1">
      {showError && <ValidationMessage message={error} />}
    </div>
  </div>
);

const ValidationMessage = ({ message }: { message: string }) => (
  <div className="flex items-center gap-1 text-xs text-yellow-400">
    <ExclamationCircleIcon className="w-4 h-4" />
    <span>{message}</span>
  </div>
);

export default Signup;