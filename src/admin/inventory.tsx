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
    const [search, setSearch] = useState('');
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

    const filteredInventory = React.useMemo(() => {
        if (!search.trim()) return inventory;

        const keywords = search.toLowerCase().split(/\s+/).filter(Boolean);

        const scoredItems = inventory.map(item => {
            const nameLower = item.name.toLowerCase();
            let matchCount = 0;
            for (const kw of keywords) {
                if (nameLower.includes(kw)) matchCount++;
            }
            return { item, matchCount };
        });

        return scoredItems
            .filter(({ matchCount }) => matchCount > 0)
            .sort((a, b) => b.matchCount - a.matchCount)
            .map(({ item }) => item);
    }, [inventory, search]);

    return (
        <AdminLayout pageName="Inventory">
            <div className="mt-6 flex justify-end w-full max-w-screen-2xl px-4">
                <div className="relative w-full max-w-md mb-4">
                    <input
                        type="text"
                        placeholder="Search inventory..."
                        className="w-full pr-10 pl-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                            aria-label="Clear search"
                            type="button"
                        >
                            &#x2715;
                        </button>
                    )}
                </div>
            </div>

            <div
                className="bg-white bg-opacity-60 backdrop-blur-md rounded-2xl shadow-lg w-full max-w-screen-2xl overflow-y-auto p-4 scrollbar-hide"
                style={{ height: 'calc(100vh - 280px)' }}
            >
                {loading ? (
                    <div className="text-center text-gray-500 mt-10">Loading...</div>
                ) : filteredInventory.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">No items match your search.</div>
                ) : (
                    <ul className="space-y-4">
                        {filteredInventory.map((item) => (
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

        </AdminLayout>
    );
};

export default InventoryPage;