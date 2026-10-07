import type { TrackMedia } from "@/lib/media"

let audio: HTMLAudioElement | undefined
let video: HTMLVideoElement | undefined

export type PlayMediaOptions = {
  startAtSec?: number
  /** Reprend depuis startAtSec même si déjà en lecture. */
  forceRestart?: boolean
}

function sameSrc(el: HTMLMediaElement, url: string) {
  try {
    return el.src === new URL(url, window.location.origin).href
  } catch {
    return el.getAttribute("src") === url
  }
}

export function getSharedAudio() {
  if (typeof window === "undefined") {
    throw new Error("getSharedAudio is client-only")
  }
  if (!audio) {
    audio = new Audio()
    audio.controls = true
    audio.preload = "auto"
    audio.className = "w-full"
  }
  return audio
}

export function getSharedVideo() {
  if (typeof window === "undefined") {
    throw new Error("getSharedVideo is client-only")
  }
  if (!video) {
    video = document.createElement("video")
    video.controls = true
    video.playsInline = true
    video.preload = "auto"
    video.className = "absolute inset-0 size-full bg-black object-contain"
  }
  return video
}

export function pauseSharedMedia() {
  audio?.pause()
  video?.pause()
}

function applyStart(el: HTMLMediaElement, startAtSec: number) {
  if (startAtSec <= 0) return
  try {
    el.currentTime = startAtSec
  } catch {
    /* ignore seek errors before ready */
  }
}

function playFromStart(el: HTMLMediaElement, startAtSec: number) {
  const run = () => {
    applyStart(el, startAtSec)
    return el.play().catch(() => undefined)
  }
  if (startAtSec <= 0 || el.readyState >= 1) return run()
  return new Promise<void>((resolve) => {
    const onReady = () => {
      el.removeEventListener("loadedmetadata", onReady)
      void run().then(resolve)
    }
    el.addEventListener("loadedmetadata", onReady)
  })
}

function playElement(el: HTMLMediaElement, url: string, options: PlayMediaOptions = {}) {
  const startAtSec = options.startAtSec ?? 0
  const forceRestart = options.forceRestart ?? false

  if (!sameSrc(el, url)) {
    el.src = url
    el.load()
    return playFromStart(el, startAtSec)
  }

  if (forceRestart) {
    return playFromStart(el, startAtSec)
  }

  if (!el.paused) {
    return Promise.resolve()
  }

  if (el.ended || el.currentTime < startAtSec) {
    return playFromStart(el, startAtSec)
  }

  return el.play().catch(() => undefined)
}

export function playSharedMedia(media: TrackMedia, options: PlayMediaOptions = {}) {
  if (media.kind === "video") {
    audio?.pause()
    return playElement(getSharedVideo(), media.url, options)
  }
  video?.pause()
  return playElement(getSharedAudio(), media.url, options)
}

export function startTrackMedia(
  media: TrackMedia | undefined,
  options: PlayMediaOptions = {}
) {
  if (media) return playSharedMedia(media, options).catch(() => undefined)
  pauseSharedMedia()
  return Promise.resolve()
}
