import { Check } from "lucide-react";

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export default function PricingCard({
  name,
  price,
  description,
  features,
  cta,
  highlighted = false,
}: PricingCardProps) {
  return (
    <div
      className={`relative group transition-all duration-300 ${
        highlighted ? "md:scale-105" : ""
      }`}
    >
      {/* Glow effect for highlighted card */}
      {highlighted && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300 -z-10" />
      )}

      <div
        className={`relative rounded-2xl backdrop-blur-sm transition-all duration-300 ${
          highlighted
            ? "bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/30"
            : "bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50"
        }`}
      >
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
            <p className="text-sm text-slate-400">{description}</p>
          </div>

          {/* Price */}
          <div className="mb-8">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold text-white">{price}</span>
              {price !== "Custom" && (
                <span className="text-slate-400 text-lg">/month</span>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <button
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 mb-8 ${
              highlighted
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:shadow-lg hover:shadow-amber-500/50 active:scale-95"
                : "bg-slate-700/50 text-slate-100 border border-slate-600/50 hover:bg-slate-700 hover:border-slate-500/50 active:scale-95"
            }`}
          >
            {cta}
          </button>

          {/* Features */}
          <div className="space-y-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              What&apos;s included
            </p>
            <ul className="space-y-3">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check
                    size={18}
                    className={`flex-shrink-0 mt-0.5 ${
                      highlighted ? "text-amber-400" : "text-slate-500"
                    }`}
                  />
                  <span className="text-sm text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
