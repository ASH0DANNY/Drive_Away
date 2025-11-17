import ReservationForm from "@/components/ReservationForm";

export const metadata = {
  title: "Book Your Vehicle - Drive Away",
  description: "Easy online booking for cars and bikes",
};

export default function Booking() {
  return (
    <>
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 md:py-32">
        <div className="container-section">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="section-title">Book Your Vehicle</h1>
            <p className="section-subtitle">
              Complete the form below to reserve your perfect ride
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <ReservationForm />
          </div>
        </div>
      </section>

      {/* How To Book */}
      <section className="bg-gray-50 container-section">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Easy Booking Process
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Fill Form</h3>
            <p className="text-gray-600">
              Provide your details and preferences
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Select Vehicle
            </h3>
            <p className="text-gray-600">Choose from our available fleet</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Confirm Details
            </h3>
            <p className="text-gray-600">Review and confirm booking</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              4
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Complete</h3>
            <p className="text-gray-600">Pick up your vehicle</p>
          </div>
        </div>
      </section>
    </>
  );
}
