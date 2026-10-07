"use client"

import { useEffect, useLayoutEffect, useRef } from "react"

import { thumbnailUrl } from "@/lib/playlist"
import type { MatchableTrack } from "@/lib/playlists"
import type { TrackMedia } from "@/lib/media"
import {
  getSharedAudio,
  getSharedVideo,
  pauseSharedMedia,
  startTrackMedia,
} from "@/lib/shared-media"

export function PauseLocalMedia() {
  useEffect(() => {
    pauseSharedMedia()
  }, [])
  return null
}

export function LocalPlayer({
  track,
  media,
  nextMedia,
  startAtSec = 0,
  nextStartAtSec = 0,
  onAdvance,
}: {
  track: MatchableTrack & { title: string; artist: string }
  media: TrackMedia
  nextMedia: TrackMedia | undefined
  startAtSec?: number
  nextStartAtSec?: number
  onAdvance: () => void
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef(media)
  const startAtRef = useRef(startAtSec)
  const nextStartAtRef = useRef(nextStartAtSec)
  const onAdvanceRef = useRef(onAdvance)
  const nextMediaRef = useRef(nextMedia)
  mediaRef.current = media
  startAtRef.current = startAtSec
  nextStartAtRef.current = nextStartAtSec
  onAdvanceRef.current = onAdvance
  nextMediaRef.current = nextMedia

  useLayoutEffect(() => {
    const host = hostRef.current
    if (!host) return

    const el = media.kind === "video" ? getSharedVideo() : getSharedAudio()
    if (el.parentNode !== host) host.appendChild(el)
    void startTrackMedia(mediaRef.current, {
      startAtSec: startAtRef.current,
      forceRestart: true,
    })

    function onEnded() {
      // Start the next file in the same media element (keeps autoplay unlocked),
      // then update the route/UI.
      void startTrackMedia(nextMediaRef.current, {
        startAtSec: nextStartAtRef.current,
        forceRestart: true,
      })
      onAdvanceRef.current()
    }

    function onTimeUpdate() {
      const floor = startAtRef.current
      if (floor > 0 && el.currentTime < floor - 0.35) {
        el.currentTime = floor
      }
    }

    el.addEventListener("ended", onEnded)
    el.addEventListener("timeupdate", onTimeUpdate)
    return () => {
      el.removeEventListener("ended", onEnded)
      el.removeEventListener("timeupdate", onTimeUpdate)
    }
  }, [media.kind, media.url, startAtSec])

  useEffect(() => {
    const host = hostRef.current
    const kind = media.kind
    return () => {
      const el = kind === "video" ? getSharedVideo() : getSharedAudio()
      if (host && el.parentNode === host) host.removeChild(el)
    }
  }, [media.kind])

  if (media.kind === "video") {
    return (
      <div
        ref={hostRef}
        className="absolute inset-0 size-full bg-black"
        suppressHydrationWarning
      />
    )
  }

  const cover = thumbnailUrl(track)

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
        <div ref={hostRef} suppressHydrationWarning />
      </div>
    </div>
  )
}
