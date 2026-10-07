"use client"

import { useEffect } from "react"
import { Printer } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { TRACKS } from "@/lib/playlist"

const STORAGE_KEY = "le-bal-track"

export function PlayerEffects({
  index,
  nextHref,
  prevHref,
}: {
  index: number
  nextHref: string | null
  prevHref: string | null
}) {
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, TRACKS[index].id)
  }, [index])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement) return
      if (event.key === "ArrowRight" && nextHref) window.location.assign(nextHref)
      if (event.key === "ArrowLeft" && prevHref) window.location.assign(prevHref)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [nextHref, prevHref])

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
