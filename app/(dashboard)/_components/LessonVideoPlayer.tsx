import { getYouTubeEmbedUrl } from "@/lib/services/student-course-service";

type LessonVideoPlayerProps = {
  videoUrl: string | null;
  title: string;
};

export function LessonVideoPlayer({ videoUrl, title }: LessonVideoPlayerProps) {
  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-neutral-200 bg-customer-charcoal shadow-sm">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-linear-to-br from-customer-purple via-customer-teal to-customer-gold px-6 text-center">
          <p className="text-sm font-semibold text-customer-cream">
            Video coming soon
          </p>
          <p className="mt-1 text-xs text-customer-cream/80">
            Read the lesson notes below to continue learning.
          </p>
        </div>
      )}
    </div>
  );
}
