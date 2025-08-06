import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNotification } from '../multishareCodes/notificationProvider';
import { BACKEND_URL } from '../config';
import khaltiLogo from '../assets/khalti.svg';

const PaymentPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [status, setStatus] = useState<string | null>(null);
    const [txnId, setTxnId] = useState<string | null>(null);
    const [message, setMessage] = useState<string>('Processing payment...');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const statusParam = queryParams.get('status');
        const pidx = queryParams.get('pidx');

        setStatus(statusParam);
        setTxnId(pidx);

        if (!pidx) {
            setMessage('Missing transaction identifier');
            showNotification('Missing transaction identifier (pidx)', 'error');
            return;
        }

        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        const validatePayment = async () => {
            await delay(1000);

            try {
                const res = await fetch(`${BACKEND_URL}/api/payment/verify`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ pidx, status: statusParam }),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    showNotification(errorData.message || 'Payment verification failed', 'error');
                    setMessage('Payment verification failed');
                    return;
                }

                if (statusParam === 'Completed') {
                    setMessage('Payment Successful');
                    showNotification('Payment verified successfully', 'success');
                } else if (statusParam === 'User canceled') {
                    setMessage('Sorry, it did not go as expected. You cancelled the payment.');
                    showNotification('Payment was cancelled by the user.', 'warning');
                } else {
                    setMessage('Sorry, it did not go as expected.');
                    showNotification('Unexpected payment status.', 'warning');
                }
            } catch (error) {
                showNotification('Network error during payment verification', 'error');
                setMessage('Network error');
            }
        };

        validatePayment();
    }, [location.search, showNotification]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
            <div className="bg-white text-black rounded-xl shadow-xl p-8 w-full max-w-md text-center">
                <img src={khaltiLogo} alt="Khalti Logo" className="w-24 mx-auto mb-6" />
                <h1 className="text-2xl font-bold mb-4">E-pasal × Khalti</h1>
                <p className="text-lg font-medium mb-4">{message}</p>
                <p className="text-lg font-medium mb-4">{status}</p>
                {txnId && (
                    <p className="text-sm text-gray-600 mb-6">
                        <span className="font-semibold">Transaction ID:</span> {txnId}
                    </p>
                )}
                <p className="text-sm text-gray-600 mb-6">
                    You will receive your gmail shortly. Thank you for the patience.
                </p>
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