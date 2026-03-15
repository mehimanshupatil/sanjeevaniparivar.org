/** Shared centred section header used across all sections */
interface SectionHeaderProps {
  tag: string;
  heading: string;
  sub?: string;
  light?: boolean;        // white text on dark bg
  tagClass?: string;      // override pill colour
}

export default function SectionHeader({ tag, heading, sub, light, tagClass }: SectionHeaderProps) {
  return (
    <div className="text-center mb-14">
      <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${tagClass ?? (light ? 'bg-white/15 text-white' : 'bg-accent-light text-primary')}`}>
        {tag}
      </span>
      <h2 className={`mt-2 text-4xl font-extrabold leading-tight ${light ? 'text-white' : 'text-gray-900'}`}>
        {heading}
      </h2>
      {sub && (
        <p className={`mt-3 max-w-lg mx-auto ${light ? 'text-white/60' : 'text-gray-500'}`}>{sub}</p>
      )}
    </div>
  );
}
