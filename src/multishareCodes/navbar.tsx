import React, { useState } from "react";
import { FaShoppingCart , FaUser,  } from "react-icons/fa";
import { FiRepeat } from "react-icons/fi";
import { TiArrowSortedDown } from "react-icons/ti";


const Navbar =() => {

    const [openMenu, setOpenMenu] =useState(null);
    const toggleMenu = (menuName)=> {
        setOpenMenu(openMenu == menuName ? null : menuName);
    };

    return(
        <header className="bg-white shadow">
            <div className="flex justify-between items-center px-8 py-6 relative" style={{ top: "8px" }}>
                <h1 className="text-4xl font-extrabold cursor-pointer tracking-widest">EPASAL</h1>
                <div className="flex gap-4 text-2xl ">
                    <FaShoppingCart title="Cart" className="cursor-pointer" />
                    <FiRepeat  title="Compare" className="cursor-pointer" />
                    <FaUser title="Account" className="cursor-pointer" />
                </div>
            </div>

            <nav className="bg-black text-white text-lg">
                <ul className="flex justify-start gap-20 py-3 px-20">
                 <li className={`flex items-center cursor-pointer ${
                    openMenu === "home" ? "font-bold" : "font-normal"
                 }`}
                  onClick={() => toggleMenu("home")}>
                    Home
                    <TiArrowSortedDown className={`ml-1 w-4 h-4 transition-transform duration-300 relative ${
                         openMenu === "home" ? "rotate-180" : "rotate-0"
                          }`} 
                          style={{ top: "2px" }}
                    />
                 </li>

                 <li className={`flex items-center cursor-pointer ${
                    openMenu === "contact" ? "font-bold" : "font-normal"
                 }`}
                 onClick={() => toggleMenu("contact")}>
                    Contact
                    <TiArrowSortedDown className={`ml-1 w-4 h-4 transition-transform duration-300 relative ${
                         openMenu === "contact" ? "rotate-180" : "rotate-0"
                          }`} 
                          style={{ top: "2px" }}
                    />
                 </li>

                 <li className={`flex items-center cursor-pointer ${
                    openMenu === "accessories" ? "font-bold" : "font-normal"
                 }`}
                 onClick={() => toggleMenu("accessories")}>
                    Accessories
                    <TiArrowSortedDown className={`ml-1 w-4 h-4 transition-transform duration-300 relative ${
                         openMenu === "accessories" ? "rotate-180" : "rotate-0"
                          }`} 
                          style={{ top: "2px" }}
                    />
                 </li>

                 <li className={`flex items-center cursor-pointer ${
                    openMenu === "laptop" ? "font-bold" : "font-normal"
                 }`}
                 onClick={() => toggleMenu("laptop")}>
                    Laptop by brands
                    <TiArrowSortedDown className={`ml-1 w-4 h-4 transition-transform duration-300 relative ${
                         openMenu === "laptop" ? "rotate-180" : "rotate-0"
                          }`} 
                          style={{ top: "2px" }}
                    />
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;