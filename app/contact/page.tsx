"use client";

import { useState } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { appConfig } from "@/config/app-config";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 md:py-32">
        <div className="container-section">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="section-title">Get In Touch</h1>
            <p className="section-subtitle">
              We'd love to hear from you. Reach out to us anytime
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="container-section">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="card text-center">
            <div className="text-5xl mb-4 text-black flex justify-center">
              <FaPhone />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Phone</h3>
            <a
              href={`tel:${appConfig.app.mobile}`}
              className="text-gray-600 hover:text-black transition"
            >
              {appConfig.app.mobile}
            </a>
          </div>
          <div className="card text-center">
            <div className="text-5xl mb-4 text-black flex justify-center">
              <FaEnvelope />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
            <a
              href={`mailto:${appConfig.app.email}`}
              className="text-gray-600 hover:text-black transition"
            >
              {appConfig.app.email}
            </a>
          </div>
          <div className="card text-center">
            <div className="text-5xl mb-4 text-black flex justify-center">
              <FaMapMarkerAlt />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Address</h3>
            <p className="text-gray-600">{appConfig.app.address}</p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-gray-50 container-section">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Send us a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message here..."
                rows={6}
                required
                className="input-field resize-none"
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              {isSubmitted ? "✓ Message Sent!" : "Send Message"}
            </button>
          </form>
        </div>
      </section>

      {/* Map Section */}
      <section className="container-section">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Visit Our Office
        </h2>
        <div className="bg-gray-100 h-96 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📍</div>
            <p className="text-gray-600">Google Maps Integration Coming Soon</p>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="bg-gray-50 container-section">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Business Hours
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Weekdays</h3>
              <p className="text-gray-600">Monday - Friday</p>
              <p className="text-xl font-semibold text-black">
                8:00 AM - 8:00 PM
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Weekends</h3>
              <p className="text-gray-600">Saturday - Sunday</p>
              <p className="text-xl font-semibold text-black">
                9:00 AM - 6:00 PM
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="bg-black text-white container-section text-center">
        <h2 className="text-3xl font-bold mb-8">Follow Us</h2>
        <div className="flex justify-center space-x-6">
          <a
            href={appConfig.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl hover:text-gray-300 transition"
          >
            <FaFacebook />
          </a>
          <a
            href={appConfig.social.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl hover:text-gray-300 transition"
          >
            <FaTwitter />
          </a>
          <a
            href={appConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl hover:text-gray-300 transition"
          >
            <FaInstagram />
          </a>
        </div>
      </section>
    </>
  );
}
