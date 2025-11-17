import {
  FaCar,
  FaWrench,
  FaShieldAlt,
  FaHeadset,
  FaMapMarkerAlt,
  FaCreditCard,
} from "react-icons/fa";
import { ServiceCard } from "@/components/ServiceCard";
import Link from "next/link";

export const metadata = {
  title: "Services - Drive Away",
  description: "Explore our comprehensive car and bike rental services",
};

export default function Services() {
  const mainServices = [
    {
      title: "Daily Rentals",
      description: "Perfect for your daily transportation needs",
      features: [
        "24-hour rental period",
        "Unlimited mileage",
        "Flexible pickup/dropoff",
      ],
      price: "Starting at $25/day",
      icon: <FaCar />,
    },
    {
      title: "Weekly Rentals",
      description: "Great discounts for extended stays",
      features: ["7-day rental period", "10% discount", "Free maintenance"],
      price: "Starting at $150/week",
      icon: <FaCar />,
    },
    {
      title: "Monthly Rentals",
      description: "Best value for long-term needs",
      features: ["30-day rental period", "20% discount", "Insurance included"],
      price: "Starting at $500/month",
      icon: <FaCar />,
    },
  ];

  const additionalServices = [
    {
      icon: <FaWrench />,
      title: "Maintenance & Support",
      description: "24/7 roadside assistance and vehicle maintenance",
    },
    {
      icon: <FaShieldAlt />,
      title: "Comprehensive Insurance",
      description: "Full coverage options for peace of mind",
    },
    {
      icon: <FaHeadset />,
      title: "Customer Support",
      description: "Expert support available round the clock",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Multiple Locations",
      description: "Convenient pickup and drop-off points",
    },
    {
      icon: <FaCreditCard />,
      title: "Flexible Payment",
      description: "Multiple payment options available",
    },
    {
      icon: <FaCar />,
      title: "Premium Fleet",
      description: "Latest models and well-maintained vehicles",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 md:py-32">
        <div className="container-section">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="section-title">Our Services</h1>
            <p className="section-subtitle">
              Comprehensive rental solutions tailored to your needs
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="container-section">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Rental Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mainServices.map((service, idx) => (
            <ServiceCard key={idx} {...service} />
          ))}
        </div>
      </section>

      {/* Vehicle Categories */}
      <section className="bg-gray-50 container-section">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Vehicle Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <div className="text-5xl mb-4 text-black">🚗</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Economy Cars
            </h3>
            <p className="text-gray-600 mb-4">
              Fuel-efficient and easy to park, perfect for city driving and
              budget-conscious travelers.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Air conditioning</li>
              <li>✓ Power steering</li>
              <li>✓ Backup camera</li>
            </ul>
          </div>
          <div className="card">
            <div className="text-5xl mb-4 text-black">🚙</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">SUVs</h3>
            <p className="text-gray-600 mb-4">
              Spacious and powerful, ideal for family trips and rough terrain
              adventures.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>✓ High seating capacity</li>
              <li>✓ Advanced safety features</li>
              <li>✓ Superior handling</li>
            </ul>
          </div>
          <div className="card">
            <div className="text-5xl mb-4 text-black">✨</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Luxury Vehicles
            </h3>
            <p className="text-gray-600 mb-4">
              Premium comfort and style for special occasions and business
              trips.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Premium leather seats</li>
              <li>✓ Advanced entertainment</li>
              <li>✓ Luxurious amenities</li>
            </ul>
          </div>
          <div className="card">
            <div className="text-5xl mb-4 text-black">🚲</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Bikes</h3>
            <p className="text-gray-600 mb-4">
              Eco-friendly transportation for urban exploration and fitness
              enthusiasts.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Multiple types available</li>
              <li>✓ Helmets included</li>
              <li>✓ Maintenance support</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="container-section">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Additional Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {additionalServices.map((service, idx) => (
            <div key={idx} className="text-center">
              <div className="text-5xl mb-4 text-black flex justify-center">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 container-section">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Choose Vehicle
            </h3>
            <p className="text-gray-600 text-sm">
              Browse and select from our fleet
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Pick Date & Time
            </h3>
            <p className="text-gray-600 text-sm">Select your rental period</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Confirm Booking
            </h3>
            <p className="text-gray-600 text-sm">Complete your reservation</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              4
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Pick & Enjoy
            </h3>
            <p className="text-gray-600 text-sm">
              Get your keys and start driving
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white container-section text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl text-gray-300 mb-8">
          Book your perfect vehicle today
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Browse Vehicles
        </Link>
      </section>
    </>
  );
}
