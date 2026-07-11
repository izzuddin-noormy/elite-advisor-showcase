export type VideoEmbed = { type: 'youtube' | 'vimeo' | 'file' | 'iframe'; src: string };

/**
 * Normalises a video URL (YouTube, Vimeo, direct file, or other embeddable URL)
 * into something the gallery can render.
 */
export function getVideoEmbed(url?: string | null): VideoEmbed | null {
  if (!url) return null;
  const u = url.trim();
  if (!u) return null;

  // YouTube
  const yt = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  if (yt) return { type: 'youtube', src: `https://www.youtube.com/embed/${yt[1]}` };

  // Vimeo
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { type: 'vimeo', src: `https://player.vimeo.com/video/${vm[1]}` };

  // Direct video file
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(u)) return { type: 'file', src: u };

  // Fallback: assume it is already an embeddable URL
  return { type: 'iframe', src: u };
}
