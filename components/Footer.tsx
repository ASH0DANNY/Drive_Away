import Link from "next/link";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { appConfig } from "@/config/app-config";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container-section bg-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {appConfig.app.name}
            </h2>
            <p className="text-gray-300 mb-6">{appConfig.app.description}</p>
            <div className="flex space-x-4">
              <a
                href={appConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href={appConfig.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href={appConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href={appConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition"
              >
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-white transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-gray-300 hover:text-white transition"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Fleet */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Our Fleet</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition"
                >
                  Economy Cars
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition"
                >
                  Luxury Cars
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition"
                >
                  SUVs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition"
                >
                  Bikes
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FaPhone className="text-gray-400 mt-1" />
                <a
                  href={`tel:${appConfig.app.mobile}`}
                  className="text-gray-300 hover:text-white transition"
                >
                  {appConfig.app.mobile}
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <FaEnvelope className="text-gray-400 mt-1" />
                <a
                  href={`mailto:${appConfig.app.email}`}
                  className="text-gray-300 hover:text-white transition"
                >
                  {appConfig.app.email}
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-gray-400 mt-1" />
                <p className="text-gray-300">{appConfig.app.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="text-gray-400 text-center md:text-left">
              &copy; {currentYear} {appConfig.app.name}. All rights reserved.
            </p>
            <div className="flex justify-center md:justify-end space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
