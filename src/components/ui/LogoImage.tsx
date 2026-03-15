/** Shared logo image with graceful hide-on-error */
interface LogoImageProps {
  className?: string;
  alt?: string;
}

export default function LogoImage({ className = '', alt = 'Sanjeevani Parivar' }: LogoImageProps) {
  return (
    <img
      src="/assets/logo.png"
      alt={alt}
      className={className}
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
    />
  );
}
