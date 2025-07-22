import React, { useEffect, useState } from 'react';
import AdminLayout from './adminLayout';
import { BACKEND_URL } from '../config';
import { useNotification } from '../multishareCodes/notificationProvider';

type InventoryItem = {
    id: number;
    name: string;
    product_type: string;
    quantity: number;
    image: string;
};

const InventoryPage: React.FC = () => {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/inventory`);
                if (!response.ok) throw new Error('Failed to fetch inventory data');
                const data = await response.json();
                setInventory(data);
            } catch (err: any) {
                showNotification('Error fetching inventory: ' + err.message, 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, [showNotification]);

    return (
        <AdminLayout pageName="Inventory">
            <div className="mt-6 flex justify-center">
                <div
                    className="bg-white bg-opacity-60 backdrop-blur-md rounded-2xl shadow-lg w-full max-w-screen-2xl overflow-y-auto p-4 scrollbar-hide"
                    style={{ height: 'calc(100vh - 240px)' }}
                >
                    {loading ? (
                        <div className="text-center text-gray-500 mt-10">Loading...</div>
                    ) : (
                        <ul className="space-y-4">
                            {inventory.map((item) => (
                                <li
                                    key={item.id}
                                    className="flex items-center justify-between bg-white bg-opacity-80 px-4 py-4 rounded-md shadow-sm"
                                >
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 rounded-md object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                if (!target.dataset.fallbackTried) {
                                                    target.dataset.fallbackTried = "true";
                                                    target.src = `${BACKEND_URL}/${item.image}`;
                                                } else {
                                                    target.src = "https://http.cat/404";
                                                }
                                            }}
                                        />
                                        <div>
                                            <p className="text-lg font-semibold">{item.name}</p>
                                            <p className="text-sm text-gray-600">
                                                Type: {item.product_type}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                                            Add more Stock
                                        </button>
                                        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                                            Remove from Stock
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default InventoryPage;