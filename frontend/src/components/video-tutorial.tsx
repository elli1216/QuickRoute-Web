import { useState } from 'react'
import { Maximize2, Sparkles, Youtube } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'

interface VideoTutorialProps {
  /**
   * YouTube URL (e.g. 'https://www.youtube.com/watch?v=VIDEO_ID', 'https://youtu.be/VIDEO_ID') or Video ID directly
   */
  youtubeUrl?: string
  /**
   * Path or URL to a direct MP4 file (Fallback if YouTube URL is not provided)
   * Default: '/tutorial.mp4'
   */
  videoSrc?: string
  /**
   * Optional poster image path shown before video plays (for MP4 player)
   */
  posterSrc?: string
  /**
   * Whether to show player controls on the card player. Default: false
   */
  showControls?: boolean
  /**
   * Whether to autoplay the video on page load. Default: true
   */
  autoplay?: boolean
}

/**
 * Utility function to extract YouTube Video ID from any YouTube URL format or raw ID.
 */
export function getYouTubeId(urlOrId?: string): string | null {
  if (!urlOrId) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = urlOrId.match(regExp)
  return match && match[2].length === 11 ? match[2] : urlOrId.trim()
}

export function VideoTutorialHeroCard({
  youtubeUrl,
  videoSrc = '/tutorial.mp4',
  posterSrc,
  showControls = false,
  autoplay = true,
}: VideoTutorialProps) {
  const [isOpen, setIsOpen] = useState(false)
  const youtubeId = getYouTubeId(youtubeUrl)

  // Construct YouTube embed URL for card player:
  // vq=hd1080 forces 1080p quality mode.
  // autoplay=1&mute=1 is required by modern browsers for unprompted autoplay.
  // controls=0 hides video controls entirely.
  // loop=1&playlist=ID enables continuous looping.
  const embedUrl = youtubeId
    ? `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=${autoplay ? 1 : 0}&mute=1&controls=${showControls ? 1 : 0}&loop=1&playlist=${youtubeId}&modestbranding=1&rel=0&vq=hd1080`
    : null

  // Embed URL for expanded theater modal:
  const modalEmbedUrl = youtubeId
    ? `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&modestbranding=1&rel=0&vq=hd1080`
    : null

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 md:mt-16 px-4">
      {/* Video Card Container */}
      <div className="relative group rounded-3xl p-2 bg-linear-to-b from-blue-500/20 via-indigo-500/10 to-transparent backdrop-blur-xl border border-white/20 dark:border-slate-800/60 shadow-2xl shadow-blue-500/10 hover:shadow-indigo-500/20 transition-all duration-500">
        {/* Glow accent */}
        <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-35 transition duration-500 -z-10" />

        {/* Video Header Badge */}
        <div className="flex items-center justify-between px-4 py-2.5 mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {youtubeId ? (
              <Youtube className="w-4 h-4 text-red-500" />
            ) : (
              <Sparkles className="w-4 h-4 animate-pulse" />
            )}
            <span>Video Walkthrough</span>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Expand View</span>
          </button>
        </div>

        {/* Embedded Video Player Container */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 shadow-inner">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title="QuickRoute Video Tutorial"
              className="w-full h-full border-0 pointer-events-none sm:pointer-events-auto"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video
              autoPlay={autoplay}
              muted
              loop
              controls={showControls}
              playsInline
              preload="metadata"
              poster={posterSrc}
              className="w-full h-full object-cover"
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>

      {/* Full-screen / Focus Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-5xl p-2 md:p-4 bg-slate-950 border-slate-800 text-white overflow-hidden">
          <DialogHeader className="px-2 pt-2">
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-slate-100">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Video Tutorial
            </DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black mt-2">
            {isOpen &&
              (modalEmbedUrl ? (
                <iframe
                  src={modalEmbedUrl}
                  title="QuickRoute Video Tutorial Modal"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  loop
                  muted
                  autoPlay
                  playsInline
                  poster={posterSrc}
                  className="w-full h-full object-contain"
                >
                  <source src={videoSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
