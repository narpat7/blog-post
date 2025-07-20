import React from "react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigator = useNavigate();

  return (
    <footer className="bg-[#FFDCDC] text-gray-800 py-10 px-6 md:px-20">
      <div className="items-center justify-items-center text-center max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        
        {/* Logo & Tagline */}
        <div>
          <h2 className="text-2xl font-bold text-[#E63946]">C-Fitness</h2>
          <p className="mt-3 text-sm text-gray-700">
            Your partner in health and fitness journey.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-[#E63946] mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li onClick={()=>navigator("/aboutus")} className="hover:underline cursor-pointer">About Us</li>
            <li><a href="/services" className="hover:underline">Services</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold text-[#E63946] mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li onClick={()=>navigator("/articles")} className="hover:underline cursor-pointer">Fitness Blog</li>
            <li><a href="/nutrition" className="hover:underline">Nutrition Tips</a></li>
            <li><a href="/workouts" className="hover:underline">Workout Plans</a></li>
            <li onClick={()=>navigator("/faq")} className="hover:underline cursor-pointer">FAQ</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-[#E63946] mb-4">Get in Touch</h3>
          <p className="text-sm text-gray-700">📧 support@cfitness.com</p>
          <p className="text-sm text-gray-700 mt-1">📞 +91-9876543210</p>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-[#E63946] mt-10 pt-4 text-center text-sm text-gray-700">
        © {new Date().getFullYear()} C-Fitness. All rights reserved.
      </div>
    </footer>
  );
}
