interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  image: string;
  rating?: number;
}

export default function TestimonialCard({
  quote,
  author,
  role,
  image,
  rating = 5,
}: TestimonialCardProps) {
  return (
    <div className="group relative bg-white border-2 border-stone-200 p-8 transition-all duration-300 hover:border-amber-400 hover:shadow-xl hover:-translate-y-1">
      {/* Accent corner */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-amber-300 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Quote mark */}
      <div className="text-5xl text-amber-200 font-serif mb-4 leading-none">
        &quot;
      </div>

      {/* Quote text */}
      <p className="text-stone-700 font-serif text-lg leading-relaxed mb-6">
        {quote}
      </p>

      {/* Rating */}
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "fill-amber-400" : "fill-stone-300"
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>

      {/* Author info */}
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={author}
          className="w-12 h-12 rounded-full object-cover border-2 border-stone-200 group-hover:border-amber-400 transition-colors"
        />
        <div>
          <p className="font-semibold text-stone-900 text-sm">{author}</p>
          <p className="text-stone-500 text-xs uppercase tracking-wide">
            {role}
          </p>
        </div>
      </div>
    </div>
  );
}
