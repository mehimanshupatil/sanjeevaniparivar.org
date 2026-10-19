// Plays a YouTube video in a popup instead of leaving the site. Pass `video` to open it,
// null to close. The player only loads while the popup is open.
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { SiYoutube } from '@icons-pack/react-simple-icons';

export interface Video {
  url: string;
  title: string;
  subtitle?: string;
}

/** The id from youtu.be/ID, youtube.com/watch?v=ID, /embed/ID, /shorts/ID or /live/ID; null otherwise */
export function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1) || null;
    if (u.hostname.endsWith('youtube.com')) {
      return u.searchParams.get('v') ?? u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1] ?? null;
    }
  } catch { /* not a URL */ }
  return null;
}

interface Props {
  video: Video | null;
  onClose: () => void;
}

export default function YoutubeDialog({ video, onClose }: Props) {
  const id = video && youtubeId(video.url);
  return (
    <Dialog open={Boolean(video)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="gap-4 bg-gray-950 p-3 text-white ring-white/10 sm:max-w-4xl sm:p-4 [&_[data-slot=dialog-close]]:text-white [&_[data-slot=dialog-close]]:hover:bg-white/10">
        <div className="pr-10">
          <DialogTitle className="text-base font-bold leading-snug">{video?.title}</DialogTitle>
          {video?.subtitle && <DialogDescription className="mt-1 text-sm text-white/60">{video.subtitle}</DialogDescription>}
        </div>
        {id && (
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
              title={video?.title}
              className="size-full"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
        )}
        {video && (
          <a href={video.url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start text-sm text-white/70 hover:text-white">
            <SiYoutube className="size-4 text-[#FF0000]" /> YouTube वर उघडा
          </a>
        )}
      </DialogContent>
    </Dialog>
  );
}
