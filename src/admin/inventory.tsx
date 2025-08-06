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
    cost_price: number;
};

const InventoryPage: React.FC = () => {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { showNotification } = useNotification();

    const [editingCostPrices, setEditingCostPrices] = useState<{ [id: number]: string }>({});

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

    const startEditing = (id: number, currentPrice: number) => {
        setEditingCostPrices(prev => ({ ...prev, [id]: currentPrice.toString() }));
    };

    const onCostPriceChange = (id: number, value: string) => {
        if (/^\d*\.?\d*$/.test(value)) {
            setEditingCostPrices(prev => ({ ...prev, [id]: value }));
        }
    };

    const saveCostPrice = async (id: number) => {
    const newPriceStr = editingCostPrices[id];
    if (!newPriceStr) return;

    // Validate if newPriceStr is a valid decimal string
    if (!/^\d*\.?\d*$/.test(newPriceStr)) {
        showNotification('Invalid cost price entered', 'error');
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/inventory/${id}/cost_price`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            // Send cost_price as string to match backend BigDecimal expectation
            body: JSON.stringify({ cost_price: newPriceStr }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update cost price');
        }

        setInventory(prev =>
            prev.map(item =>
                item.id === id ? { ...item, cost_price: parseFloat(newPriceStr) } : item
            )
        );

        showNotification('Cost price updated successfully', 'success');
        setEditingCostPrices(prev => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
        });
    } catch (err: any) {
        showNotification('Error updating cost price: ' + err.message, 'error');
    }
};

    const cancelEditing = (id: number) => {
        setEditingCostPrices(prev => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
        });
    };

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
                        {filteredInventory.map((item) => {
                            const isEditing = editingCostPrices.hasOwnProperty(item.id);
                            return (
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
                                            <p className="text-sm text-gray-600">
                                                Cost Price:{' '}
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
                                                        value={editingCostPrices[item.id]}
                                                        onChange={(e) => onCostPriceChange(item.id, e.target.value)}
                                                    />
                                                ) : (
                                                    item.cost_price.toFixed(2)
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        {isEditing ? (
                                            <>
                                                <button
                                                    onClick={() => saveCostPrice(item.id)}
                                                    className="mr-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => cancelEditing(item.id)}
                                                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => startEditing(item.id, item.cost_price)}
                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                Update Cost Price
                                            </button>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </AdminLayout>
    );
};

export default InventoryPage;