import { useState, useEffect, useRef } from "react";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { FiRepeat } from "react-icons/fi";
import { TiArrowSortedDown } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  isLoggedIn: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn }) => {
  type MenuName = "home" | "contact" | "accessories" | "laptop" | null;
  const [openMenu, setOpenMenu] = useState<MenuName>(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [,setUserData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (menuName: MenuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  useEffect(() => {
    if (isLoggedIn) {
      setUserData({
        name: sessionStorage.getItem("name") || "",
        email: sessionStorage.getItem("email") || "",
        phone: sessionStorage.getItem("phone") || "",
      });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowProfilePopup(false);
      }
    };

    if (showProfilePopup) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showProfilePopup]);

  const handleLogout = () => {
    sessionStorage.clear();
    setShowProfilePopup(false);
    window.location.href = "/";
  };

  return (
    <>
      <header className="bg-white shadow relative z-10">
        <div className="flex justify-between items-center px-8 py-6">
          <h1 className="text-4xl font-extrabold cursor-pointer tracking-widest">
            EPASAL
          </h1>
          <div className="flex gap-6 text-2xl relative">
            <FaShoppingCart title="Cart" className="cursor-pointer" />
            <FiRepeat title="Compare" className="cursor-pointer" />
            <div>
              <FaUser
                title="Account"
                className="cursor-pointer"
                onClick={() => setShowProfilePopup(!showProfilePopup)}
              />

              {showProfilePopup && (
                <>
                  <div className="fixed inset-0 bg-black bg-opacity-40 z-30" />

                  <div
                    ref={popupRef}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl p-6 z-40 text-left border border-gray-200"
                    style={{ top: "48px" }}
                  >
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                      {isLoggedIn ? "👋 Welcome Back!" : "Guest Account"}
                    </h3>

                    {isLoggedIn ? (
                      <div className="text-gray-700 text-sm font-inter space-y-2">
                        <div>
                          <span className="block font-semibold text-gray-600">User ID</span>
                          <span className="text-gray-800 break-all">
                            {sessionStorage.getItem("userId")}
                          </span>
                        </div>
                        <div>
                          <span className="block font-semibold text-gray-600">Name</span>
                          <span className="text-gray-800">
                            {sessionStorage.getItem("name")}
                          </span>
                        </div>
                        <div>
                          <span className="block font-semibold text-gray-600">Email</span>
                          <span className="text-gray-800 break-words">
                            {sessionStorage.getItem("email")}
                          </span>
                        </div>
                        <div>
                          <span className="block font-semibold text-gray-600">Phone</span>
                          <span className="text-gray-800">
                            {sessionStorage.getItem("phone")}
                          </span>
                        </div>

                        <button
                          onClick={handleLogout}
                          className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all font-semibold"
                        >
                          🚪 Logout
                        </button>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-700">
                        <p className="mb-4">You are browsing as a guest.</p>
                        <button
                          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                          onClick={() => {
                            navigate("/login");
                            setShowProfilePopup(false);
                          }}
                        >
                          🔐 Login Now
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <nav className="bg-black text-white text-lg">
          <ul className="flex justify-start gap-20 py-3 px-20">
            {["home", "contact", "accessories", "laptop"].map((item) => (
              <li
                key={item}
                className={`flex items-center cursor-pointer ${openMenu === item ? "font-bold" : "font-normal"
                  }`}
                onClick={() => toggleMenu(item as MenuName)}
              >
                {item === "laptop"
                  ? "Laptop by brands"
                  : item.charAt(0).toUpperCase() + item.slice(1)}
                <TiArrowSortedDown
                  className={`ml-1 w-4 h-4 transition-transform duration-300 relative ${openMenu === item ? "rotate-180" : "rotate-0"
                    }`}
                  style={{ top: "2px" }}
                />
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Navbar;