import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import khaltiLogo from '../assets/khalti.svg'; 

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<string | null>(null);
  const [txnId, setTxnId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('Processing payment...');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status');
    const txnId = queryParams.get('txnId') || queryParams.get('transaction_id');

    setStatus(status);
    setTxnId(txnId);

    if (status === 'Completed') {
      setMessage('Payment Successful');
    } else if (status === 'User cancelled') {
      setMessage('Payment Failed');
    } else {
      setMessage('Unknown Payment Status');
    }
  }, [location.search]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="bg-white text-black rounded-xl shadow-xl p-8 w-full max-w-md text-center">
        <img src={khaltiLogo} alt="Khalti Logo" className="w-24 mx-auto mb-6" />

        <h1 className="text-2xl font-bold mb-4">E-pasal × Khalti</h1>
        <p className="text-lg font-medium mb-4">{message}</p>

        {txnId && (
          <p className="text-sm text-gray-600 mb-6">
            <span className="font-semibold">Transaction ID:</span> {txnId}
          </p>
        )}

        <button
          onClick={() => navigate('/')}
          className="bg-black text-white border border-white hover:bg-white hover:text-black transition-colors font-semibold py-2 px-6 rounded-full"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;