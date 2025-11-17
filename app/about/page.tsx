import { FaAward, FaUsers, FaHandshake, FaGlobeAmericas } from "react-icons/fa";
import Link from "next/link";

export const metadata = {
  title: "About Us - Drive Away",
  description:
    "Learn about Drive Away, your trusted car and bike rental partner",
};

export default function About() {
  const values = [
    {
      icon: <FaAward />,
      title: "Quality First",
      description: "We maintain the highest standards for all our vehicles",
    },
    {
      icon: <FaUsers />,
      title: "Customer Centric",
      description: "Your satisfaction is our top priority",
    },
    {
      icon: <FaHandshake />,
      title: "Transparency",
      description: "Fair pricing with no hidden charges",
    },
    {
      icon: <FaGlobeAmericas />,
      title: "Eco-Friendly",
      description: "Promoting sustainable transportation solutions",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 md:py-32">
        <div className="container-section">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="section-title">About Drive Away</h1>
            <p className="section-subtitle">
              Revolutionizing urban mobility with premium rental services
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="container-section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4 text-lg leading-relaxed">
              Drive Away was founded with a simple mission: to make vehicle
              rentals accessible, affordable, and hassle-free for everyone. We
              started with just 50 vehicles and have grown to over 500 vehicles
              across 25 locations.
            </p>
            <p className="text-gray-600 mb-4 text-lg leading-relaxed">
              Today, we serve thousands of customers annually, from daily
              commuters to adventure seekers. Our commitment to quality and
              customer service has made us the most trusted rental service in
              the region.
            </p>
            <Link href="/" className="btn-primary inline-block">
              Book Your Ride
            </Link>
          </div>
          <div className="bg-gray-100 h-96 rounded-xl flex items-center justify-center">
            <div className="text-6xl text-gray-400">📸</div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-black text-white container-section">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-5xl font-bold mb-2">500+</h3>
            <p className="text-gray-300">Vehicles</p>
          </div>
          <div>
            <h3 className="text-5xl font-bold mb-2">25+</h3>
            <p className="text-gray-300">Locations</p>
          </div>
          <div>
            <h3 className="text-5xl font-bold mb-2">10K+</h3>
            <p className="text-gray-300">Happy Customers</p>
          </div>
          <div>
            <h3 className="text-5xl font-bold mb-2">8+</h3>
            <p className="text-gray-300">Years Experience</p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container-section">
        <h2 className="section-title text-center mb-12">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, idx) => (
            <div key={idx} className="text-center">
              <div className="text-5xl mb-4 text-black flex justify-center">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {value.title}
              </h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 container-section">
        <h2 className="section-title text-center mb-4">Leadership Team</h2>
        <p className="section-subtitle text-center">
          Meet the people behind Drive Away
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="card text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">👤</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Team Member {idx}
              </h3>
              <p className="text-gray-600 mb-2">Designation</p>
              <p className="text-gray-500 text-sm">
                Passionate about delivering exceptional service and innovation
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white container-section text-center">
        <h2 className="text-4xl font-bold mb-4">
          Experience the Drive Away Difference
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Join thousands of satisfied customers
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Book Now
        </Link>
      </section>
    </>
  );
}
