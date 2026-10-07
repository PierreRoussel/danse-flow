import type { MatchableTrack } from "@/lib/playlists"

export const MEDIA_EXTENSIONS = [
  "mp3",
  "m4a",
  "aac",
  "wav",
  "ogg",
  "flac",
  "mp4",
  "m4v",
  "webm",
] as const

export type MediaKind = "audio" | "video"

export type TrackMedia = {
  trackId: string
  filename: string
  url: string
  kind: MediaKind
  score: number
}

export type MediaLibrary = {
  matched: TrackMedia[]
  missing: { id: string; title: string; artist: string }[]
  unmatchedFiles: string[]
}

export function mediaKind(filename: string): MediaKind {
  const ext = filename.split(".").pop()?.toLowerCase()
  return ext === "mp4" || ext === "m4v" || ext === "webm" ? "video" : "audio"
}

export function isMediaFilename(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase()
  return Boolean(ext && MEDIA_EXTENSIONS.includes(ext as (typeof MEDIA_EXTENSIONS)[number]))
}

const STOP = new Set(["the", "a", "an", "le", "la", "les", "de", "du", "des", "el"])

const JUNK =
  /\b(official|officiel|video|audio|lyrics?|paroles?|letra|clip|hd|4k|uhd|remastered|youtube|music|version|wedding|visualizer|hq|live|topic|vevo|lyric|audio)\b/gi

export function foldText(input: string) {
  return input
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(JUNK, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function tokens(input: string) {
  return foldText(input).split(" ").filter((token) => token.length > 1 && !STOP.has(token))
}

function coverage(needed: string[], haystack: Set<string>) {
  if (needed.length === 0) return 0
  const hit = needed.filter((token) => haystack.has(token)).length
  return hit / needed.length
}

const ALIASES: Record<string, string[]> = {
  ordinary: ["ordinary", "alex warren"],
  "all-of-me": ["all of me", "john legend"],
  "wanna-dance": ["i wanna dance with somebody", "whitney"],
  "cant-stop-the-feeling": ["cant stop the feeling", "timberlake"],
  "thats-what-i-like": ["thats what i like"],
  "i-gotta-feeling": ["i gotta feeling", "gotta feeling", "black eyed peas"],
  "lamour-toujours": ["lamour toujours", "amour toujours", "gigi"],
  "livin-on-a-prayer": ["livin on a prayer", "living on a prayer"],
  "its-raining-men": ["its raining men", "raining men"],
  "wake-me-up-wham": ["wake me up before you go", "wham"],
  "summer-of-69": ["summer of 69"],
  "mambo-no-5": ["mambo no 5", "mambo number 5", "mambo 5"],
  connemara: ["connemara", "lacs du connemara", "sardou"],
  "dont-stop-believin": ["dont stop believin", "dont stop believing"],
  "kickstart-my-heart": ["kickstart my heart"],
  "je-te-promets": ["je te promets", "johnny hallyday"],
  "je-danse-le-mia": ["je danse le mia", "danse le mia"],
  "party-rock": ["party rock anthem", "party rock"],
  "we-found-love": ["we found love"],
  "dont-stop-me-now": ["dont stop me now"],
  "dont-start-now": ["dont start now"],
}

function scoreFileAgainstTrack(
  filename: string,
  track: MatchableTrack,
  trackIndex: number
) {
  const base = filename.replace(/\.[^.]+$/, "")
  const folded = foldText(base)
  const fileTokens = new Set(tokens(base))

  if (track.youtubeId && filename.includes(track.youtubeId)) return 100
  if (foldText(base.replace(/^\d+\s*/, "")) === track.id.replaceAll("-", " ")) return 98
  if (folded === foldText(track.title)) return 92

  const titleTokens = tokens(track.title)
  const artistTokens = tokens(track.artist)
  const titleScore = coverage(titleTokens, fileTokens)
  const artistScore = coverage(artistTokens, fileTokens)

  let score = titleScore * 72 + artistScore * 22

  if (titleTokens.length > 0 && titleScore === 1) score += 8
  if (folded.includes(foldText(track.title))) score += 10

  for (const alias of ALIASES[track.id] ?? []) {
    if (folded.includes(foldText(alias))) score += 12
  }

  const numbered = base.match(/^(\d{1,2})\b/)
  if (numbered && Number(numbered[1]) === trackIndex + 1) score += 6

  return Math.min(score, 99)
}

export function matchMediaFiles(
  filenames: string[],
  tracks: readonly MatchableTrack[],
  overrides: Record<string, string> = {}
): MediaLibrary {
  const files = filenames.filter(isMediaFilename)
  const usedFiles = new Set<string>()
  const byTrack = new Map<string, TrackMedia>()

  for (const [trackId, filename] of Object.entries(overrides)) {
    if (!files.includes(filename) || !tracks.some((track) => track.id === trackId)) continue
    usedFiles.add(filename)
    byTrack.set(trackId, {
      trackId,
      filename,
      url: mediaFileUrl(filename),
      kind: mediaKind(filename),
      score: 100,
    })
  }

  const pairs: { filename: string; trackId: string; score: number }[] = []
  for (const filename of files) {
    if (usedFiles.has(filename)) continue
    tracks.forEach((track, index) => {
      if (byTrack.has(track.id)) return
      const score = scoreFileAgainstTrack(filename, track, index)
      if (score >= 58) pairs.push({ filename, trackId: track.id, score })
    })
  }

  pairs.sort((a, b) => b.score - a.score)
  for (const pair of pairs) {
    if (usedFiles.has(pair.filename) || byTrack.has(pair.trackId)) continue
    usedFiles.add(pair.filename)
    byTrack.set(pair.trackId, {
      trackId: pair.trackId,
      filename: pair.filename,
      url: mediaFileUrl(pair.filename),
      kind: mediaKind(pair.filename),
      score: Math.round(pair.score),
    })
  }

  const matched = tracks
    .map((track) => byTrack.get(track.id))
    .filter((item): item is TrackMedia => Boolean(item))
  const missing = tracks.filter((track) => !byTrack.has(track.id)).map((track) => ({
    id: track.id,
    title: track.title,
    artist: track.artist,
  }))
  const unmatchedFiles = files.filter((filename) => !usedFiles.has(filename))

  return { matched, missing, unmatchedFiles }
}

export function mediaFileUrl(filename: string) {
  return `/api/media/file?name=${encodeURIComponent(filename)}`
}

export function mediaByTrackId(library: MediaLibrary) {
  return Object.fromEntries(library.matched.map((item) => [item.trackId, item])) as Record<
    string,
    TrackMedia
  >
}
