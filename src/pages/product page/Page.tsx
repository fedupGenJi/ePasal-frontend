import { Button } from "../../components/ui/button";
import { Search, ShoppingCart, Heart, Scale, User, Phone, Mail } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import demoLogo from '../../assets/demologo.avif';
import { Separator } from "@/components/ui/separator"

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Header */}
      <div className="bg-gray-900 text-white text-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span>Need help?</span>
            <span>Contact</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>My Account</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Sign in</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Primary Logo - Left side */}
          <div className="h-12">
            <img src={demoLogo} alt="ePasal Logo" className="h-full object-contain" />
          </div>

          {/* Secondary Logo - Used for symmetrical design */}
          <div className="h-12">
            <img src={demoLogo} alt="ePasal Logo" className="h-full object-contain" />
          </div>

          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Input placeholder="Search products..." className="w-full pr-12 bg-white text-black" />
              <Button size="sm" className="absolute right-0 top-0 h-full bg-red-600 hover:bg-red-700">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5" />
              <span>Compare</span>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Shopping cart</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <span>My Wish List</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src="/placeholder.svg?height=500&width=500"
                alt="Lenovo Legion 5 2024"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-100 rounded border-2 border-transparent hover:border-red-500 cursor-pointer"
                >
                  <img
                    src={`/placeholder.svg?height=100&width=100&query=Lenovo Legion 5 angle ${i}`}
                    alt={`Product view ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Lenovo Legion 5 2024 - Intel Core i9, RTX 4060</h1>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">Gaming Laptop</Badge>
                <Badge variant="outline">Intel i9</Badge>
                <Badge variant="outline">RTX 4060</Badge>
              </div>
            </div>

            <div className="text-4xl font-bold text-red-600">NPR 2,89,999</div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Key Specifications:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Processor: Intel Core i9-13900HX</li>
                <li>• Graphics: NVIDIA GeForce RTX 4060 8GB</li>
                <li>• RAM: 16GB DDR5</li>
                <li>• Storage: 1TB NVMe SSD</li>
                <li>• Display: 15.6" FHD 165Hz</li>
                <li>• Operating System: Windows 11 Home</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button size="lg" className="flex-1 bg-red-600 hover:bg-red-700">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="flex-1 bg-transparent">
                <Heart className="w-5 h-5 mr-2" />
                Add to Wishlist
              </Button>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 bg-transparent">
                <Scale className="w-4 h-4 mr-2" />
                Compare
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <Phone className="w-4 h-4 mr-2" />
                Call for Price
              </Button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Availability & Delivery</h4>
              <p className="text-sm text-gray-600">
                ✅ In Stock - Ready for immediate delivery
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
            <p className="text-gray-700 leading-relaxed mb-4">
              The Lenovo Legion 5 2024 is a powerhouse gaming laptop designed for serious gamers and content creators.
              Featuring the latest Intel Core i9-13900HX processor and NVIDIA GeForce RTX 4060 graphics card, this
              laptop delivers exceptional performance for gaming, streaming, and creative work.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              With its 15.6-inch Full HD display running at 165Hz, you'll experience smooth, tear-free gaming with
              vibrant colors and sharp details. The 16GB DDR5 RAM ensures seamless multitasking, while the 1TB NVMe SSD
              provides lightning-fast boot times and ample storage for your games and files.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Built with Lenovo's Legion TrueStrike keyboard and advanced thermal management system, the Legion 5 is
              engineered for long gaming sessions without compromise on performance or comfort.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Support Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Support</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <span>support@itti.com.np</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span>+977-1-4444444</span>
                </div>
              </div>
            </div>

            {/* Newsletter Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-300 mb-4">
                Trade Alert - Delivering the latest product trends and industry news straight to your inbox.
              </p>
              <div className="flex gap-2">
                <Input placeholder="Your email address" className="flex-1 bg-gray-800 border-gray-700 text-white" />
                <Button className="bg-red-600 hover:bg-red-700">Subscribe</Button>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-gray-700" />

          <div className="text-center text-gray-400">
            <p>&copy; 2024 ITTI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
