'use client';

import { FaCar, FaHeadset, FaMapMarkerAlt, FaCreditCard, FaShieldAlt, FaClock, FaUsers, FaBicycle, FaTrophy, FaHeart } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import ReservationForm from "@/components/ReservationForm";
import { ServiceCard } from "@/components/ServiceCard";
import { TestimonialGrid } from "@/components/TestimonialCard";
import Link from "next/link";
import { useScrollAnimations } from "@/hooks/useScrollAnimation";
import './animations.css';

export default function Home() {
  useScrollAnimations();

  const services = [
    {
      title: "Economy Cars",
      description: "Perfect for daily commuting and budget-friendly travel",
      icon: <FaCar className="text-3xl" />,
      features: ["Fuel efficient", "Compact design", "Easy parking"],
      price: "$25/day",
    },
    {
      title: "SUVs & Crossovers",
      description: "Spacious vehicles for family trips and adventures",
      icon: <FaCar className="text-3xl" />,
      features: ["High ground clearance", "Spacious interior", "Advanced safety"],
      price: "$45/day",
    },
    {
      title: "Luxury Vehicles",
      description: "Experience premium comfort and style",
      icon: <FaTrophy className="text-3xl" />,
      features: ["Premium interiors", "Advanced tech", "Superior comfort"],
      price: "$75/day",
    },
  ];

  const bikes = [
    {
      title: "Mountain Bikes",
      description: "Adventure-ready bikes for off-road trails",
      icon: <FaBicycle className="text-3xl" />,
      features: ["All-terrain tires", "Suspension system", "Lightweight"],
      price: "$15/day",
    },
    {
      title: "Road Bikes",
      description: "Speed and efficiency for long-distance rides",
      icon: <FaBicycle className="text-3xl" />,
      features: ["Carbon frame", "Drop bars", "High speed"],
      price: "$20/day",
    },
    {
      title: "City Bikes",
      description: "Comfortable bikes for urban exploration",
      icon: <FaHeart className="text-3xl" />,
      features: ["Upright position", "Storage", "Durable"],
      price: "$10/day",
    },
  ];

  const testimonials = [
    {
      author: "Sarah Johnson",
      role: "Business Traveler",
      content: "Excellent service! The car was clean, well-maintained, and the booking process was seamless.",
      rating: 5,
    },
    {
      author: "Michael Chen",
      role: "Tourist",
      content: "Perfect for exploring the city. Staff was helpful and prices were competitive.",
      rating: 5,
    },
    {
      author: "Emma Davis",
      role: "Adventure Enthusiast",
      content: "Rented a bike for weekend exploration. Great quality and amazing customer support!",
      rating: 5,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 md:py-32">
        <div className="container-section">
          <div className="text-center max-w-3xl mx-auto">
            <h1 
              data-animate="fade-in"
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Your Journey Starts Here
            </h1>
            <p 
              data-animate="slide-up"
              data-animate-delay="100"
              className="text-xl text-gray-600 mb-8"
            >
              Discover affordable and reliable car and bike rentals. Book your perfect ride today!
            </p>
            <div 
              data-animate="slide-up"
              data-animate-delay="200"
              className="flex gap-4 justify-center flex-wrap"
            >
              <Link href="#booking" className="btn-primary inline-flex items-center gap-2">
                Reserve Now <FiArrowRight />
              </Link>
              <Link href="/signin" className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors border-2 border-black inline-flex items-center gap-2">
                Sign In <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Features */}
      <section className="container-section">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div 
            data-animate="slide-up"
            data-animate-delay="100"
            className="text-center"
          >
            <div className="text-4xl mb-3 text-black flex justify-center">
              <FaCar />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">500+ Vehicles</h3>
            <p className="text-gray-600 text-sm">Wide selection of cars and bikes</p>
          </div>
          <div 
            data-animate="slide-up"
            data-animate-delay="200"
            className="text-center"
          >
            <div className="text-4xl mb-3 text-black flex justify-center">
              <FaCreditCard />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Best Prices</h3>
            <p className="text-gray-600 text-sm">Competitive rates and flexible plans</p>
          </div>
          <div 
            data-animate="slide-up"
            data-animate-delay="300"
            className="text-center"
          >
            <div className="text-4xl mb-3 text-black flex justify-center">
              <FaHeadset />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-gray-600 text-sm">Round-the-clock customer service</p>
          </div>
          <div 
            data-animate="slide-up"
            data-animate-delay="400"
            className="text-center"
          >
            <div className="text-4xl mb-3 text-black flex justify-center">
              <FaShieldAlt />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Fully Insured</h3>
            <p className="text-gray-600 text-sm">Complete insurance coverage included</p>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="bg-gray-50 py-16 md:py-24">
        <div className="container-section">
          <h2 
            data-animate="slide-left"
            className="text-4xl font-bold text-gray-900 mb-12 text-center"
          >
            Quick & Easy Booking
          </h2>
          <div 
            data-animate="slide-up"
            className="max-w-3xl mx-auto"
          >
            <ReservationForm />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container-section py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 
            data-animate="fade-in"
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Our Services
          </h2>
          <p 
            data-animate="fade-in"
            data-animate-delay="100"
            className="text-gray-600 text-lg"
          >
            Choose from a wide variety of vehicles for every occasion
          </p>
        </div>

        {/* Cars Section */}
        <div className="mb-16">
          <h3 
            data-animate="slide-left"
            className="text-2xl font-bold text-gray-900 mb-8"
          >
            Premium Cars
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                data-animate="slide-up"
                data-animate-delay={`${(index + 1) * 100}`}
              >
                <ServiceCard {...service} />
              </div>
            ))}
          </div>
        </div>

        {/* Bikes Section */}
        <div>
          <h3 
            data-animate="slide-left"
            className="text-2xl font-bold text-gray-900 mb-8"
          >
            Bikes & Cycles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bikes.map((bike, index) => (
              <div
                key={index}
                data-animate="slide-up"
                data-animate-delay={`${(index + 1) * 100}`}
              >
                <ServiceCard {...bike} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container-section">
          <h2 
            data-animate="fade-in"
            className="text-4xl font-bold text-gray-900 mb-12 text-center"
          >
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              data-animate="scale"
              data-animate-delay="100"
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <FaMapMarkerAlt className="text-4xl text-black mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Multiple Locations</h3>
              <p className="text-gray-600">
                With branches across the city, we make it convenient for you to pick up and drop off vehicles wherever you need.
              </p>
            </div>

            <div 
              data-animate="scale"
              data-animate-delay="200"
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <FaClock className="text-4xl text-black mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quick Booking</h3>
              <p className="text-gray-600">
                Book your vehicle in minutes with our streamlined booking process. No hassle, just simplicity.
              </p>
            </div>

            <div 
              data-animate="scale"
              data-animate-delay="300"
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <FaUsers className="text-4xl text-black mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Team</h3>
              <p className="text-gray-600">
                Our friendly team is always ready to help you find the perfect vehicle for your journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container-section py-16 md:py-24">
        <h2 
          data-animate="fade-in"
          className="text-4xl font-bold text-gray-900 mb-12 text-center"
        >
          What Our Customers Say
        </h2>
        <div 
          data-animate="slide-up"
        >
          <TestimonialGrid testimonials={testimonials} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black py-16 md:py-24">
        <div className="container-section text-center">
          <h2 
            data-animate="fade-in"
            className="text-4xl font-bold text-white mb-6"
          >
            Ready to Start Your Adventure?
          </h2>
          <p 
            data-animate="fade-in"
            data-animate-delay="100"
            className="text-xl text-gray-300 mb-8"
          >
            Create an account today and get exclusive offers!
          </p>
          <div 
            data-animate="slide-up"
            data-animate-delay="200"
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link href="/signup" className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
              Sign Up Now <FiArrowRight />
            </Link>
            <Link href="/signin" className="bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors inline-flex items-center gap-2">
              Already a Member? <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
