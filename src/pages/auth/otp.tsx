import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Background from '../../multishareCodes/background';
import { BACKEND_URL } from '../../config';

const Otp: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { temp_id, otp } = location.state || {};

  const [enteredOtp, setEnteredOtp] = useState<string[]>(['', '', '', '', '']);
  const [isValid, setIsValid] = useState<null | boolean>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!temp_id || !otp) {
      setIsAuthorized(false);
      toast.error('Unauthorized access. Redirecting to signup.', {
        onClose: () => navigate('/signup'),
      });
    }
  }, [temp_id, otp, navigate]);

  useEffect(() => {
    if (isAuthorized && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [isAuthorized]);

  const verifyOtpAndFinalizeSignup = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temp_id }),
      });

      if (!response.ok) {
        const error = await response.text();
        toast.error(`Verification failed: ${error}`, {
          onClose: () => navigate('/signup'),
        });
        return;
      }

      toast.success('Signup complete! Redirecting to login...', {
        onClose: () => navigate('/login'),
      });
    } catch (error: unknown) {
      toast.error(`Network error: ${error instanceof Error ? error.message : String(error)}`, {
        onClose: () => navigate('/signup'),
      });
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!isAuthorized || !/^[0-9]?$/.test(value)) return;

    const newOtp = [...enteredOtp];
    newOtp[index] = value;
    setEnteredOtp(newOtp);

    if (value && index < enteredOtp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== '')) {
      const enteredCode = newOtp.join('');
      if (enteredCode === otp) {
        setIsValid(true);
        verifyOtpAndFinalizeSignup();
      } else {
        setIsValid(false);
        toast.error('OTP does not match. Try again.', {
          onClose: () => navigate('/otp', { state: { temp_id, otp } }),
        });
      }
    }
  };

  const handleBack = () => {
    navigate('/signup');
  };

  return (
    <Background>
      <div className="flex justify-start items-start w-screen h-screen pt-32 pl-32 pr-32 pb-32">
        <div className="flex flex-col items-start w-[26rem]">
          <h2 className="text-3xl text-white font-pacifico mb-4">Otp Verification</h2>
          <p className="text-white text-sm mb-8">Check your email for the OTP</p>

          <div className="flex space-x-3 mb-8">
            {enteredOtp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                ref={(el) => (inputsRef.current[index] = el)}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace') {
                    if (enteredOtp[index] === '') {
                      if (index > 0) {
                        inputsRef.current[index - 1]?.focus();
                        const newOtp = [...enteredOtp];
                        newOtp[index - 1] = '';
                        setEnteredOtp(newOtp);
                      }
                    } else {
                      const newOtp = [...enteredOtp];
                      newOtp[index] = '';
                      setEnteredOtp(newOtp);
                    }
                  }
                }}
                disabled={!isAuthorized}
                className={`w-12 h-14 text-center text-xl rounded-lg outline-none border-2 
    ${isValid === null ? 'border-gray-300' : isValid ? 'border-green-500' : 'border-red-500'} 
    bg-white text-black focus:border-blue-400 transition-all duration-200 
    ${!isAuthorized ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            ))}
          </div>

          <button
            onClick={handleBack}
            className="text-sm text-blue-200 hover:underline"
          >
            ← Back to Signup
          </button>
        </div>
      </div>
    </Background>
  );
};

export default Otp;