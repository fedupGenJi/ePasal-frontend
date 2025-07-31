import { Button } from "../../components/ui/button";
import { ShoppingCart, Heart, Scale } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import Navbar from "../../multishareCodes/navbar";
import Footer from "../../multishareCodes/footer";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BACKEND_URL } from "../../config";


interface ProductDetails {
  brand_name: string;
  display_name: string;
  model_name: string;
  model_year: string;
  product_type: string;
  product_authetication: string;
  suitable_for: string;
  color: string;
  ram: number;
  ram_type: string;
  processor: string;
  processor_series: string;
  processor_generation: string;
  storage: number;
  storage_type: string;
  warranty: string;
  graphic: string;
  graphic_ram: number;
  display: string;
  display_type: string;
  battery: string;
  power_supply: string;
  touchscreen: boolean;
  cost_price: number;
  quantity: number;
  faceImage: string;
  sideImages: string[];
}

export default function ProductPage() {
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productId = new URLSearchParams(location.search).get('id');
        if (!productId) return;

        const response = await fetch(`${BACKEND_URL}/api/products/${productId}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [location]);
  return (
    <div className="min-h-screen bg-white">
      <Navbar isLoggedIn={false} />

      {/* Product Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product?.faceImage ? `${BACKEND_URL}/${product.faceImage}` : '/placeholder.svg?height=500&width=500'}
                alt={product?.display_name || "Product Image"}
                className="w-full h-full object-cover object-center"
                width={800}
                height={800}
                loading="eager"
                decoding="sync"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product?.sideImages.map((image, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-100 rounded border-2 border-transparent hover:border-red-500 cursor-pointer"
                >
                  <img
                    src={`${BACKEND_URL}/${image}`}
                    alt={`${product.display_name} view ${i + 1}`}
                    className="w-full h-full object-cover object-center"
                    width={200}
                    height={200}
                    loading={i < 2 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>
              )) || []}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product?.display_name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{product?.product_type}</Badge>
                <Badge variant="outline">{product?.processor_series}</Badge>
                <Badge variant="outline">{product?.graphic}</Badge>
              </div>
            </div>

            <div className="text-4xl font-bold text-red-600">Rs. {product?.cost_price.toLocaleString()}</div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Key Specifications:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Brand: {product?.brand_name}</li>
                <li>• Model: {product?.model_name} ({product?.model_year})</li>
                <li>• Processor: {product?.processor} {product?.processor_series} {product?.processor_generation}</li>
                <li>• Graphics: {product?.graphic} {product?.graphic_ram}GB</li>
                <li>• RAM: {product?.ram}GB {product?.ram_type}</li>
                <li>• Storage: {product?.storage}GB {product?.storage_type}</li>
                <li>• Display: {product?.display} {product?.display_type}</li>
                <li>• Battery: {product?.battery}</li>
                <li>• Power Supply: {product?.power_supply}</li>
                <li>• Color: {product?.color}</li>
                <li>• Touchscreen: {product?.touchscreen ? "Yes" : "No"}</li>
                <li>• Warranty: {product?.warranty}</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button size="lg" className="flex-1 bg-red-600 hover:bg-red-700">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                Buy Now
              </Button>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 bg-transparent">
                <Scale className="w-4 h-4 mr-2" />
                Compare
              </Button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Availability & Delivery</h4>
              <p className="text-sm text-gray-600">
                {product && product.quantity > 0 ? (
                  <>✅ In Stock - Ready for immediate delivery ({product.quantity} units available)</>
                ) : (
                  <>❌ Out of Stock - Currently unavailable</>
                )}
                <br />🚚 Free delivery within Kathmandu Valley
                <br />📞 Call us for bulk orders and corporate deals
              </p>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Product Description</h2>
          <div className="prose max-w-none">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Product Authentication</h4>
                  <p className="text-gray-700">{product?.product_authetication}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Suitable For</h4>
                  <p className="text-gray-700">{product?.suitable_for}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Performance Overview</h4>
                  <p className="text-gray-700 leading-relaxed">
                    This {product?.brand_name} {product?.model_name} features a powerful {product?.processor} {product?.processor_series} processor
                    with {product?.ram}GB {product?.ram_type} RAM and {product?.storage}GB {product?.storage_type} storage.
                    The {product?.graphic} with {product?.graphic_ram}GB VRAM delivers excellent graphics performance.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Display & Design</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Features a {product?.display} {product?.display_type} display
                    {product?.touchscreen ? " with touchscreen capability" : ""}.
                    Powered by a {product?.battery} battery with {product?.power_supply} power supply.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
