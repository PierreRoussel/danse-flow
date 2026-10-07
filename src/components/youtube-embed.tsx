"use client"

import { useEffect, useRef } from "react"

import { youtubeEmbedUrl } from "@/lib/playlist"
import { pauseSharedMedia } from "@/lib/shared-media"

let apiPromise: Promise<void> | null = null

function loadYoutubeApi() {
  if (window.YT?.Player) return Promise.resolve()
  if (apiPromise) return apiPromise

  apiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      resolve()
    }
    if (!document.getElementById("yt-iframe-api")) {
      const script = document.createElement("script")
      script.id = "yt-iframe-api"
      script.src = "https://www.youtube.com/iframe_api"
      document.body.appendChild(script)
    } else if (window.YT?.Player) {
      resolve()
    }
  })

  return apiPromise
}

export function YoutubeEmbed({
  videoId,
  title,
  index,
  onEnded,
}: {
  videoId: string
  title: string
  index: number
  onEnded?: () => void
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const onEndedRef = useRef(onEnded)

  useEffect(() => {
    onEndedRef.current = onEnded
  })

  useEffect(() => {
    pauseSharedMedia()
  }, [videoId])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const iframe = document.createElement("iframe")
    iframe.id = "le-bal-yt"
    iframe.title = title
    iframe.src = youtubeEmbedUrl(videoId, index)
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    iframe.allowFullscreen = true
    iframe.className = "absolute inset-0 size-full border-0"
    host.replaceChildren(iframe)

    let cancelled = false

    async function attach() {
      if (!onEndedRef.current) return
      await loadYoutubeApi()
      if (cancelled || !window.YT?.Player) return
      if (!document.getElementById("le-bal-yt")) return
      new window.YT.Player("le-bal-yt", {
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT?.PlayerState.ENDED) {
              onEndedRef.current?.()
            }
          },
        },
      })
    }

    void attach()

    return () => {
      cancelled = true
      host.replaceChildren()
    }
  }, [videoId, title, index])

  return (
    <div
      ref={hostRef}
      className="absolute inset-0 bg-black"
      suppressHydrationWarning
    />
  )
}
