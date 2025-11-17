import { FaCheck } from "react-icons/fa";

interface Feature {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features?: string[];
  price?: string;
  className?: string;
}

export function ServiceCard({
  title,
  description,
  icon,
  features,
  price,
  className = "",
}: ServiceCardProps) {
  return (
    <div className={`card ${className}`}>
      <div className="text-5xl mb-4 text-black">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>

      {features && (
        <ul className="space-y-2 mb-6">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center space-x-2 text-gray-700">
              <FaCheck className="text-black" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {price && <p className="text-2xl font-bold text-black">{price}</p>}
    </div>
  );
}

export function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature, idx) => (
        <div key={idx} className="text-center">
          {feature.icon && (
            <div className="text-5xl mb-4 flex justify-center text-black">
              {feature.icon}
            </div>
          )}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {feature.title}
          </h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
