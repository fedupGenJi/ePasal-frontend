// Import necessary dependencies and components
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../multishareCodes/navbar';
import Footer from '../multishareCodes/footer';
import { BACKEND_URL } from '../config';
import { useNotification } from '../multishareCodes/notificationProvider';

// Define the Product type interface for type safety
type Product = {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
    brand: string;
    stock: number;
};

// Main ProductPage component
const ProductPage: React.FC = () => {
    // State management for products and UI
    const [products, setProducts] = useState<Product[]>([]); // Store all products
    const [loading, setLoading] = useState(true); // Loading state for API calls
    const [selectedBrand, setSelectedBrand] = useState<string>('all'); // Selected brand filter
    const [selectedCategory, setSelectedCategory] = useState<string>('all'); // Selected category filter
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000000 }); // Price range filter
    const [userId, setUserId] = useState<string | null>(null); // Current user ID for authentication
    const navigate = useNavigate();
    const { showNotification } = useNotification(); // Notification system

    // Effect to check and set user authentication status
    useEffect(() => {
        const session = sessionStorage.getItem('userId');
        setUserId(session);
    }, []);

    // Effect to fetch products from the backend API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/products`);
                if (!response.ok) throw new Error('Failed to fetch products');
                const data = await response.json();
                setProducts(data);
            } catch (err: any) {
                showNotification('Error fetching products: ' + err.message, 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [showNotification]); // Re-fetch when notification system changes

    // Filter products based on selected filters (brand, category, price)
    const filteredProducts = products.filter(product => {
        const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
        return matchesBrand && matchesCategory && matchesPrice;
    });

    // Extract unique brands and categories for filter dropdowns
    const uniqueBrands = Array.from(new Set(products.map(p => p.brand)));
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)));

    return (
        <>
            {/* Navigation bar with login status */}
            <Navbar isLoggedIn={!!userId} />
            
            {/* Main content container */}
            <div className="min-h-screen bg-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Filters Section - Contains all filtering options */}
                        <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow-md h-fit">
                            <h2 className="text-lg font-semibold mb-4">Filters</h2>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Brand
                                </label>
                                <select
                                    value={selectedBrand}
                                    onChange={(e) => setSelectedBrand(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="all">All Brands</option>
                                    {uniqueBrands.map(brand => (
                                        <option key={brand} value={brand}>{brand}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="all">All Categories</option>
                                    {uniqueCategories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price Range
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                                        className="w-1/2 p-2 border rounded-md"
                                        placeholder="Min"
                                    />
                                    <input
                                        type="number"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                                        className="w-1/2 p-2 border rounded-md"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="flex-1">
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                                    <p className="mt-4 text-gray-600">Loading products...</p>
                                </div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-600">No products found matching your criteria.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                                        >
                                            <div className="relative pb-[75%]">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="absolute h-full w-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        if (!target.dataset.fallbackTried) {
                                                            target.dataset.fallbackTried = "true";
                                                            target.src = `${BACKEND_URL}/${product.image}`;
                                                        } else {
                                                            target.src = "https://http.cat/404";
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                                                <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
                                                <p className="text-gray-600 text-sm mb-4">{product.category}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xl font-bold text-gray-900">
                                                        Rs. {product.price.toLocaleString()}
                                                    </span>
                                                    <button
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                                        onClick={() => navigate(`/product/${product.id}`)}
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default ProductPage;
