import {
  BASEBALL_GAME_TRACKS,
  BLIND_TEST_TRACKS,
  GATEAU_TRACKS,
  REPAS_TRACKS,
  type SimpleTrack,
} from "@/data/extra-playlists"
import { TRACKS, type Track } from "@/data/playlist"

export type PlaylistSlug =
  | "bal"
  | "repas"
  | "blind-test"
  | "baseball-game"
  | "gateau"

export type MatchableTrack = Pick<Track, "id" | "title" | "artist" | "youtubeId">

export type PlaylistMode = "full" | "simple"

export type PlaylistDef = {
  slug: PlaylistSlug
  title: string
  tagline: string
  mode: PlaylistMode
  /** Sous-dossier de musique/ ; chaîne vide = racine (Le Bal). */
  mediaSubdir: string
  tracks: readonly (Track | SimpleTrack)[]
}

/** Ordre de la soirée : BlindTest → Repas → Baseball → Gâteau → Le Bal. */
export const PLAYLISTS: PlaylistDef[] = [
  {
    slug: "blind-test",
    title: "BlindTest",
    tagline: "Vidéo MP4 locale — film, série, TV, anime.",
    mode: "simple",
    mediaSubdir: "blind-test",
    tracks: BLIND_TEST_TRACKS,
  },
  {
    slug: "repas",
    title: "Repas",
    tagline: "Musique de repas — liste et lecteur MP3 seulement.",
    mode: "simple",
    mediaSubdir: "repas",
    tracks: REPAS_TRACKS,
  },
  {
    slug: "baseball-game",
    title: "Baseball game",
    tagline: "I Will Always Love You — démarrage à 2:45, bouton Re-lancer.",
    mode: "simple",
    mediaSubdir: "baseball-game",
    tracks: BASEBALL_GAME_TRACKS,
  },
  {
    slug: "gateau",
    title: "Gâteau",
    tagline: "Même titres que le repas, dans l’ordre inverse.",
    mode: "simple",
    mediaSubdir: "repas",
    tracks: GATEAU_TRACKS,
  },
  {
    slug: "bal",
    title: "Le Bal",
    tagline: "Soirée de mariage — courbe d’énergie, consignes et secours.",
    mode: "full",
    mediaSubdir: "",
    tracks: TRACKS,
  },
]

const bySlug = new Map(PLAYLISTS.map((playlist) => [playlist.slug, playlist]))

export function getPlaylist(slug: string): PlaylistDef | undefined {
  return bySlug.get(slug as PlaylistSlug)
}

export function isPlaylistSlug(slug: string): slug is PlaylistSlug {
  return bySlug.has(slug as PlaylistSlug)
}

export function playlistHubHref(slug: PlaylistSlug) {
  if (slug === "bal") return "/bal/accueil"
  return `/p/${slug}`
}

export function playlistPlayerHref(slug: PlaylistSlug, trackId?: string) {
  const playlist = bySlug.get(slug)
  if (!playlist) return "/"
  const base = slug === "bal" ? "/bal" : `/p/${slug}`
  if (!trackId) return base
  const q = new URLSearchParams({ t: trackId })
  return `${base}?${q.toString()}`
}

/** Lien pour passer à l’étape suivante de la soirée. */
export function playlistEntryHref(slug: PlaylistSlug) {
  // Le Bal : page d’accueil du pupitre (« Ouvrir le bal »), pas le lecteur.
  if (slug === "bal") return "/bal/accueil"
  const playlist = bySlug.get(slug)
  if (!playlist) return "/"
  return playlistPlayerHref(slug, playlist.tracks[0]?.id)
}

export function nextEveningPlaylist(slug: PlaylistSlug): PlaylistDef | undefined {
  const index = PLAYLISTS.findIndex((item) => item.slug === slug)
  if (index < 0 || index >= PLAYLISTS.length - 1) return undefined
  return PLAYLISTS[index + 1]
}

export function indexFromTrackParam(
  tracks: readonly { id: string }[],
  t: string | undefined
) {
  if (!t) return 0
  const index = tracks.findIndex((track) => track.id === t)
  return index >= 0 ? index : 0
}

export function trackHrefForPlaylist(slug: PlaylistSlug, index: number) {
  const playlist = bySlug.get(slug)
  if (!playlist) return "/"
  const clamped = Math.min(Math.max(index, 0), playlist.tracks.length - 1)
  return playlistPlayerHref(slug, playlist.tracks[clamped].id)
}

export function totalDurationSec(tracks: readonly { durationSec: number }[]) {
  return tracks.reduce((sum, track) => sum + track.durationSec, 0)
}

export function resumeStorageKey(slug: PlaylistSlug) {
  return `le-bal-track:${slug}`
}
