import Image from "next/image";

interface VehicleCard {
  name: string;
  type: string;
  price: string;
  image: string;
  features: string[];
}

export function VehicleCard({
  name,
  type,
  price,
  image,
  features,
}: VehicleCard) {
  return (
    <div className="card overflow-hidden hover:shadow-lg transition-shadow">
      {/* Vehicle Image */}
      <div className="relative w-full h-48 mb-4 bg-gray-100">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      {/* Content */}
      <div>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{name}</h3>
            <p className="text-gray-500 text-sm">{type}</p>
          </div>
          <span className="badge">{price}/day</span>
        </div>

        {/* Features */}
        <div className="space-y-2 mb-4">
          {features.map((feature, idx) => (
            <p key={idx} className="text-sm text-gray-600">
              ✓ {feature}
            </p>
          ))}
        </div>

        {/* Book Button */}
        <button className="btn-primary w-full">Book This Vehicle</button>
      </div>
    </div>
  );
}

export function VehicleGrid({ vehicles }: { vehicles: VehicleCard[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {vehicles.map((vehicle, idx) => (
        <VehicleCard key={idx} {...vehicle} />
      ))}
    </div>
  );
}
