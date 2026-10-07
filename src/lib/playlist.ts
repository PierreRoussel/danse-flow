import { PHASES, TRACKS, type PhaseId, type Track } from "@/data/playlist"

export { PHASES, TRACKS, type PhaseId, type Track }

export function formatClock(totalSec: number) {
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function formatLong(totalSec: number) {
  const h = Math.floor(totalSec / 3600)
  const m = Math.round((totalSec % 3600) / 60)
  if (h === 0) return `${m} min`
  return `${h} h ${m.toString().padStart(2, "0")}`
}

export const TOTAL_DURATION = TRACKS.reduce(
  (sum, track) => sum + track.durationSec,
  0
)

export function tracksInPhase(phase: PhaseId) {
  return TRACKS.filter((track) => track.phase === phase)
}

export function firstIndexOfPhase(phase: PhaseId) {
  return TRACKS.findIndex((track) => track.phase === phase)
}

export function phaseById(phase: PhaseId) {
  return PHASES.find((item) => item.id === phase) ?? PHASES[0]
}

export const YOUTUBE_PLAYLIST_ID = "PLOUpWDiypEN0"
export const YOUTUBE_PLAYLIST_URL = `https://www.youtube.com/playlist?list=${YOUTUBE_PLAYLIST_ID}`
export const YOUTUBE_PLAYLIST_WATCH_URL = `https://www.youtube.com/watch?v=u2ah9tWTkmk&list=${YOUTUBE_PLAYLIST_ID}`
export const YOUTUBE_MUSIC_PLAYLIST_URL = `https://music.youtube.com/playlist?list=${YOUTUBE_PLAYLIST_ID}`

export function youtubeWatchUrl(track: Track) {
  if (track.youtubeId) {
    return `https://www.youtube.com/watch?v=${track.youtubeId}&list=${YOUTUBE_PLAYLIST_ID}`
  }
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${track.artist} ${track.title} official`
  )}`
}

export function youtubeMusicWatchUrl(track: Track) {
  if (track.youtubeId) {
    return `https://music.youtube.com/watch?v=${track.youtubeId}&list=${YOUTUBE_PLAYLIST_ID}`
  }
  return `https://music.youtube.com/search?q=${encodeURIComponent(
    `${track.title} ${track.artist}`
  )}`
}

export function spotifySearchUrl(track: Track) {
  return `https://open.spotify.com/search/${encodeURIComponent(
    `${track.title} ${track.artist}`
  )}`
}

export function exportList() {
  return TRACKS.map(
    (track, index) =>
      `${String(index + 1).padStart(2, "0")}. ${track.title} — ${track.artist}`
  ).join("\n")
}

/** Format TuneMyMusic / Soundiiz : une ligne « titre - artiste ». */
export function exportSongLines() {
  return TRACKS.map((track) => `${track.title} - ${track.artist}`).join("\n")
}

export function exportYoutubeUrls() {
  return TRACKS.filter((track) => track.youtubeId)
    .map((track) => `https://www.youtube.com/watch?v=${track.youtubeId}`)
    .join("\n")
}

export const TRACKS_WITH_VIDEO = TRACKS.filter((track) => track.youtubeId)
export const TRACKS_WITHOUT_VIDEO = TRACKS.filter((track) => !track.youtubeId)

export const TUNEMYMUSIC_YOUTUBE_URL =
  "https://www.tunemymusic.com/transfer/freetext-to-youtube"
export const TUNEMYMUSIC_YOUTUBE_MUSIC_URL =
  "https://www.tunemymusic.com/transfer/freetext-to-youtube-music"

export function thumbnailUrl(track: Track) {
  if (!track.youtubeId) return null
  return `https://i.ytimg.com/vi/${track.youtubeId}/hqdefault.jpg`
}

export function trackHref(index: number) {
  const clamped = Math.min(Math.max(index, 0), TRACKS.length - 1)
  return `/bal?t=${TRACKS[clamped].id}`
}

export function indexFromTrackParam(t: string | undefined) {
  if (!t) return 0
  const index = TRACKS.findIndex((track) => track.id === t)
  return index >= 0 ? index : 0
}

export function trackHrefById(id: string) {
  return trackHref(indexFromTrackParam(id))
}

export function youtubeEmbedUrl(videoId: string, index = 0) {
  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    enablejsapi: "1",
    list: YOUTUBE_PLAYLIST_ID,
    index: String(index),
  })
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
}
