import { useState, useEffect, useRef } from "react";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { FiRepeat } from "react-icons/fi";
import { TiArrowSortedDown } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  isLoggedIn: boolean;
  userId: string | null;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, userId }) => {
  type MenuName = "home" | "contact" | "accessories" | "laptop" | null;
  const [openMenu, setOpenMenu] = useState<MenuName>(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (menuName: MenuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  // Close popup on outside click
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

              {/* Profile Dropdown */}
              {showProfilePopup && (
                <>
                  {/* Overlay */}
                  <div className="fixed inset-0 bg-black bg-opacity-40 z-30" />

                  {/* Dropdown box */}
                  <div
                    ref={popupRef}
                    className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg p-5 z-40 text-left"
                    style={{ top: "48px" }}
                  >
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">
                      {isLoggedIn ? "Welcome Back!" : "Guest Account"}
                    </h3>

                    {isLoggedIn ? (
                      <p className="text-gray-700 break-words font-mono">
                        User ID: <span className="font-semibold">{userId}</span>
                      </p>
                    ) : (
                      <>
                        <p className="mb-4 text-gray-600">
                          You are browsing as a guest.
                        </p>
                        <button
                          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                          onClick={() => {
                            navigate("/login");
                            setShowProfilePopup(false);
                          }}
                        >
                          Login Now
                        </button>
                      </>
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
                className={`flex items-center cursor-pointer ${
                  openMenu === item ? "font-bold" : "font-normal"
                }`}
                onClick={() => toggleMenu(item as MenuName)}
              >
                {item === "laptop"
                  ? "Laptop by brands"
                  : item.charAt(0).toUpperCase() + item.slice(1)}
                <TiArrowSortedDown
                  className={`ml-1 w-4 h-4 transition-transform duration-300 relative ${
                    openMenu === item ? "rotate-180" : "rotate-0"
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