import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // Adjust the path as necessary

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigator = useNavigate();
  // const isAuthenticated = localStorage.getItem("authenticated") === "true";  
  const [isAuthenticated, setIsAuthenticated] = useState(false);  

  useEffect(() => {
  const checkAuthFromServer = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const res = await fetch("http://localhost:3000/api/owner/verify-token", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      setIsAuthenticated(false);
    }
  };

  checkAuthFromServer();
}, []);


   const handleHomeClick = () => {
    if (location.pathname === "/") {
      // User already on home page – just scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navigate to home page
      navigator("/");
    }
  };

  return (
    <nav className="bg-[#FFDCDC] font-roboto shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* <div className="text-2xl font-bold text-green-600">FitZone</div> */}
        
         {/* Logo Section (Hard Left) */}
          <div onClick={() => navigator("/")} className="cursor-pointer flex items-center gap-3 pl-[2px]">
            <div className="relative">
              <img
                src={logo}
                alt="C-TECH Logo"
                className="h-14 w-14 rounded-full object-cover shadow-md"
              />
              <div onClick={() => navigator("/")} className="absolute -inset-1 rounded-full blur-md bg-blue-400 opacity-40 z-[-1]"></div>
            </div>
            {/* <span className="cursor-pointer text-3xl font-playfair font-bold tracking-wide whitespace-nowrap">
              C-TECH
            </span> */}
          </div>

        <div className="hidden md:flex space-x-6">         
          <h5 onClick={handleHomeClick}
           className="cursor-pointer text-blue-600 text-blue- text-sm font-medium hover:underline">Home</h5>
          <h5 onClick={() => navigator("/articles")}
          className="cursor-pointer text-blue-600 text-blue- text-sm font-medium hover:underline">Articles</h5>
          {isAuthenticated && (
          <h5 onClick={() => navigator("/owner/health/fitness/with/choudhary/fitness/profile/user")}
          className="cursor-pointer text-blue-600 text-blue- text-sm font-medium hover:underline">profile</h5>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setOpen(!open)}>
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white px-6 pb-4">                  
          <h5>Home</h5>
          <h5>Articles</h5>
        </div>
      )}
    </nav>
  );
}
