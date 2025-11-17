import { FaStar } from "react-icons/fa";

interface Testimonial {
  author: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
}

export function TestimonialCard({
  author,
  role,
  content,
  rating,
}: Testimonial) {
  return (
    <div className="card">
      <div className="flex items-center mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <FaStar key={i} className="text-black mr-1" />
        ))}
      </div>
      <p className="text-gray-700 mb-6 italic">"{content}"</p>
      <div>
        <h4 className="text-lg font-bold text-gray-900">{author}</h4>
        <p className="text-gray-600 text-sm">{role}</p>
      </div>
    </div>
  );
}

export function TestimonialGrid({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {testimonials.map((testimonial, idx) => (
        <TestimonialCard key={idx} {...testimonial} />
      ))}
    </div>
  );
}
