"use client"

import { thumbnailUrl, type Track } from "@/lib/playlist"
import type { TrackMedia } from "@/lib/media"

export function LocalPlayer({
  track,
  media,
  nextHref,
}: {
  track: Track
  media: TrackMedia
  nextHref: string | null
}) {
  const cover = thumbnailUrl(track)

  function onEnded() {
    if (nextHref) window.location.assign(nextHref)
  }

  if (media.kind === "video") {
    return (
      <video
        key={media.url}
        className="absolute inset-0 size-full bg-black object-contain"
        src={media.url}
        autoPlay
        controls
        playsInline
        onEnded={onEnded}
      />
    )
  }

  return (
    <div className="absolute inset-0 flex flex-col bg-[linear-gradient(160deg,oklch(0.22_0.04_40),oklch(0.14_0.02_30))]">
      <div className="relative min-h-0 flex-1">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            className="absolute inset-0 size-full object-cover opacity-50"
          />
        ) : null}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
          <p className="text-[0.7rem] tracking-[0.22em] text-primary uppercase">
            Fichier local
          </p>
          <p className="font-heading text-3xl leading-tight sm:text-4xl">{track.title}</p>
          <p className="text-muted-foreground">{track.artist}</p>
          <p className="mt-2 max-w-md truncate text-xs text-muted-foreground">
            {media.filename}
          </p>
        </div>
      </div>
      <div className="bg-black/80 px-4 py-3">
        <audio
          key={media.url}
          className="w-full"
          src={media.url}
          autoPlay
          controls
          onEnded={onEnded}
        />
      </div>
    </div>
  )
}
