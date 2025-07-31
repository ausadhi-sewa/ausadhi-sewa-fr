"use client";

import * as React from "react";
import { IconMenuDeep, IconX, IconShoppingCart, } from "@tabler/icons-react";
import logo from "../../assets/AusadhiSewa.logo.png"
import { useAppDispatch,useAppSelector } from "@/utils/hooks";
import { useNavigate } from "react-router-dom";
import {logoutUser,checkSession} from "@/features/auth/authSlice";
export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {user,loading} = useAppSelector((state)=>state.auth);
  React.useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);
  React.useEffect(() => { 
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/categories", label: "Categories" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-lg rounded-2xl mx-4 mt-2"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              {/* Medical logo icon (Tabler Heartbeat) */}
              <img src={logo} alt="Ausadhi Sewa" className="w-16 h-16" />
              <a
                href="/"
                className={`text-2xl font-bold transition-colors duration-300 ${
                  isScrolled ? "text-gray-900" : "text-gray-900"
                }`}
              >
                Ausadhi Sewa
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:scale-105 ${
                      isScrolled
                        ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* CTA & Cart Button */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <button
                onClick={() => dispatch(logoutUser())}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isScrolled
                    ? "bg-medical-green-500 text-white hover:bg-medical-green-600 shadow-lg"
                    : "bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                }`}
              >
                Logout
              </button>
              ) : (
                <button
                onClick={() => navigate("/signup")}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isScrolled
                    ? "bg-medical-green-500 text-white hover:bg-medical-green-600 shadow-lg"
                    : "bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                }`}
              >
                Sign In
              </button>
              )}
              {/* Cart Icon */}
              <button
                className={`p-2 rounded-full transition-colors duration-300 hover:bg-medical-green-50 relative`}
                aria-label="Cart"
              >
                <IconShoppingCart size={26} className="text-medical-green-600" />
                {/* Example: Cart badge (optional, static for now) */}
                <span className="absolute -top-1 -right-1 bg-medical-green-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold shadow-md">2</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-md transition-colors duration-300 ${
                  isScrolled
                    ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    : "text-white hover:text-white hover:bg-white/10"
                }`}
              >
                {isMobileMenuOpen ? <IconX size={24} /> : <IconMenuDeep size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div
            className={`md:hidden transition-all duration-300 ${
              isScrolled
                ? "bg-white/95 backdrop-blur-md shadow-lg"
                : "bg-black/90 backdrop-blur-md"
            }`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                    isScrolled
                      ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      : "text-white hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-4">
                <button
                  className={`w-full px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                    isScrolled
                      ? "bg-medical-green-500 text-white hover:bg-medical-green-600"
                      : "bg-white text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Sign In
                </button>
                {/* Cart Icon */}
                <button
                  className={`p-2 rounded-full transition-colors duration-300 hover:bg-medical-green-50 relative`}
                  aria-label="Cart"
                >
                  <IconShoppingCart size={26} className="text-medical-green-600" />
                  <span className="absolute -top-1 -right-1 bg-medical-green-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold shadow-md">2</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from hiding behind navbar */}
      <div className="h-16" />
    </>
  );
} 