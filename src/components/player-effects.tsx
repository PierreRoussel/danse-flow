"use client"

import { useEffect } from "react"
import { Printer } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { resumeStorageKey, type PlaylistSlug } from "@/lib/playlists"

export function PlayerEffects({
  slug = "bal",
  index,
  tracks,
  onNext,
  onPrev,
}: {
  slug?: PlaylistSlug
  index: number
  tracks: readonly { id: string }[]
  onNext?: () => void
  onPrev?: () => void
}) {
  useEffect(() => {
    const track = tracks[index]
    if (track) {
      window.localStorage.setItem(resumeStorageKey(slug), track.id)
    }
  }, [index, slug, tracks])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement) return
      if (event.key === "ArrowRight") onNext?.()
      if (event.key === "ArrowLeft") onPrev?.()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onNext, onPrev])

  return (
    <a
      href="#imprimer"
      className={buttonVariants({ variant: "ghost", size: "sm" })}
      onClick={(event) => {
        event.preventDefault()
        window.print()
      }}
    >
      <Printer />
      Imprimer
    </a>
  )
}
