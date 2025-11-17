"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { appConfig } from "@/config/app-config";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-black hover:text-gray-700 transition"
        >
          {appConfig.app.name}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <Link
            href="/"
            className="text-gray-700 hover:text-black transition font-medium"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-gray-700 hover:text-black transition font-medium"
          >
            About
          </Link>
          <Link
            href="/services"
            className="text-gray-700 hover:text-black transition font-medium"
          >
            Services
          </Link>
          <Link
            href="/contact"
            className="text-gray-700 hover:text-black transition font-medium"
          >
            Contact
          </Link>
        </div>

        {/* CTA Button */}
        <Link href="/booking" className="hidden md:block btn-primary">
          Book Now
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-2">
            <Link
              href="/"
              className="block py-2 text-gray-700 hover:text-black"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block py-2 text-gray-700 hover:text-black"
            >
              About
            </Link>
            <Link
              href="/services"
              className="block py-2 text-gray-700 hover:text-black"
            >
              Services
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-gray-700 hover:text-black"
            >
              Contact
            </Link>
            <Link
              href="/booking"
              className="block py-2 w-full text-center btn-primary mt-4"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
