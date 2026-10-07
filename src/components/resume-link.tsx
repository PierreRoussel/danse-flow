"use client"

import { useSyncExternalStore } from "react"

import { buttonVariants } from "@/components/ui/button"
import { TRACKS, trackHref } from "@/lib/playlist"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "le-bal-track"

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange)
  return () => window.removeEventListener("storage", onStoreChange)
}

function readTrackId() {
  return window.localStorage.getItem(STORAGE_KEY)
}

export function ResumeLink() {
  const savedId = useSyncExternalStore(subscribe, readTrackId, () => null)
  const index = TRACKS.findIndex((track) => track.id === savedId)
  if (index <= 0) return null
  const track = TRACKS[index]

  return (
    <a
      href={trackHref(index)}
      className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "h-12")}
    >
      Reprendre à {track.title}
    </a>
  )
}
