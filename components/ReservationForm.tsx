"use client";

import { useState } from "react";
import { FaUser, FaPhone, FaEnvelope, FaCar } from "react-icons/fa";

export default function ReservationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicleType: "car",
    pickupDate: "",
    returnDate: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Firebase
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        vehicleType: "car",
        pickupDate: "",
        returnDate: "",
        message: "",
      });
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Full Name
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:border-black">
            <FaUser className="text-gray-400 mr-3" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Email Address
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:border-black">
            <FaEnvelope className="text-gray-400 mr-3" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Phone Number
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:border-black">
            <FaPhone className="text-gray-400 mr-3" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              required
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Vehicle Type */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Vehicle Type
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:border-black">
            <FaCar className="text-gray-400 mr-3" />
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="w-full outline-none"
            >
              <option value="car">Economy Car</option>
              <option value="suv">SUV</option>
              <option value="luxury">Luxury Car</option>
              <option value="bike">Bike</option>
            </select>
          </div>
        </div>

        {/* Pickup Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Pickup Date
          </label>
          <input
            type="date"
            name="pickupDate"
            value={formData.pickupDate}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        {/* Return Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Return Date
          </label>
          <input
            type="date"
            name="returnDate"
            value={formData.returnDate}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Special Requests (Optional)
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Any special requirements or preferences..."
          rows={4}
          className="input-field resize-none"
        />
      </div>

      {/* Submit Button */}
      <button type="submit" className="btn-primary w-full">
        {isSubmitted ? "✓ Reservation Request Sent!" : "Request Reservation"}
      </button>
    </form>
  );
}
