import { SYMBOL } from './assets';

export interface OgCardProps {
  title: string;
  subtitle: string;
  color: string;
  /** Public path of a photo, shown on the right and faded into `color`. */
  photo?: string;
}

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

// Photos sit beside the text, not under it: many are posters full of their own text.
const PHOTO_WIDTH = 560;

// Devanagari runs wider than its character count suggests, so step the size by
// length (and by the narrower column next to a photo); line-clamp catches the rest.
function titleSize(title: string, narrow: boolean) {
  const steps = narrow ? [12, 22] : [16, 30];
  return title.length > steps[1] ? 52 : title.length > steps[0] ? 60 : 72;
}

export function OgCard({ title, subtitle, color, photo }: OgCardProps) {
  return (
    <div
      tw="flex w-full h-full relative overflow-hidden"
      style={{ width: OG_WIDTH, height: OG_HEIGHT, backgroundColor: color, fontFamily: 'Deva, Inter' }}
    >
      <div
        tw="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.14) 2px, transparent 2.5px)',
          backgroundSize: '28px 28px',
        }}
      />
      {photo ? (
        <div tw="absolute flex top-0 right-0 h-full" style={{ width: PHOTO_WIDTH }}>
          <img src={photo} tw="w-full h-full" style={{ objectFit: 'cover' }} />
          <div
            tw="absolute inset-0"
            style={{ backgroundImage: `linear-gradient(to right, ${color} 0%, ${color}00 45%)` }}
          />
        </div>
      ) : (
        <img
          src={SYMBOL}
          tw="absolute"
          style={{ width: 520, height: 557, right: -90, bottom: -150, opacity: 0.12 }}
        />
      )}

      <div
        tw="relative flex flex-col h-full"
        style={{ width: photo ? OG_WIDTH - PHOTO_WIDTH + 40 : OG_WIDTH, padding: '56px 80px 52px' }}
      >
        <div tw="flex items-center" style={{ gap: 20 }}>
          <div tw="flex items-center justify-center rounded-full bg-white" style={{ width: 72, height: 72 }}>
            <img src={SYMBOL} style={{ width: 50, height: 54 }} />
          </div>
          <span tw="text-white/80" style={{ fontSize: 22 }}>संजीवनी परिवार</span>
        </div>

        <div tw="flex-1" />

        <div
          tw="font-bold text-white"
          style={{ fontSize: titleSize(title, !!photo), lineHeight: 1.3, marginBottom: 16, lineClamp: 2 }}
        >
          {title}
        </div>
        <div tw="text-white/80" style={{ fontSize: 28, marginBottom: 40 }}>{subtitle}</div>

        <span tw="text-white/50" style={{ fontSize: 18 }}>sanjeevaniparivar.org · स्थापना १९९४ · वसई</span>
      </div>
    </div>
  );
}
