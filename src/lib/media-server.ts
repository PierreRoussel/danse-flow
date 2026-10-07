import { promises as fs } from "node:fs"
import path from "node:path"

import { isMediaFilename, matchMediaFiles, type MediaLibrary } from "@/lib/media"
import { getPlaylist, type PlaylistSlug } from "@/lib/playlists"
import { TRACKS } from "@/lib/playlist"

export function mediaDir() {
  return process.env.LE_BAL_MEDIA_DIR || path.join(process.cwd(), "musique")
}

async function listFilesInDir(dir: string, prefix = ""): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const names: string[] = []
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name
      if (entry.isFile() && isMediaFilename(entry.name)) {
        names.push(rel)
      }
    }
    return names
  } catch {
    return []
  }
}

/** Fichiers à la racine de musique/ (Le Bal), sans sous-dossiers des autres playlists. */
async function listBalRootFiles(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const names: string[] = []
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue
      if (entry.isFile() && isMediaFilename(entry.name)) {
        names.push(entry.name)
      }
    }
    return names
  } catch {
    return []
  }
}

async function readOverrides(dir: string) {
  try {
    const raw = await fs.readFile(path.join(dir, "correspondances.json"), "utf8")
    const parsed = JSON.parse(raw) as Record<string, string>
    return parsed
  } catch {
    return {}
  }
}

export async function scanMediaForPlaylist(slug: PlaylistSlug = "bal"): Promise<MediaLibrary> {
  const playlist = getPlaylist(slug)
  const tracks = playlist?.tracks ?? TRACKS
  const root = mediaDir()
  await fs.mkdir(root, { recursive: true })

  const scanDir =
    playlist && playlist.mediaSubdir
      ? path.join(root, playlist.mediaSubdir)
      : root

  if (playlist?.mediaSubdir) {
    await fs.mkdir(scanDir, { recursive: true })
  }

  const files =
    playlist && playlist.mediaSubdir
      ? await listFilesInDir(scanDir, playlist.mediaSubdir)
      : await listBalRootFiles(root)

  const overrides = await readOverrides(scanDir)
  return matchMediaFiles(files, tracks, overrides)
}

/** @deprecated Préférez scanMediaForPlaylist("bal"). */
export async function scanMedia(): Promise<MediaLibrary> {
  return scanMediaForPlaylist("bal")
}

const MIME: Record<string, string> = {
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  aac: "audio/aac",
  wav: "audio/wav",
  ogg: "audio/ogg",
  flac: "audio/flac",
  mp4: "video/mp4",
  m4v: "video/mp4",
  webm: "video/webm",
}

export function mimeFor(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase() ?? ""
  return MIME[ext] ?? "application/octet-stream"
}

export function resolveMediaPath(filename: string) {
  const dir = path.resolve(mediaDir())
  const cleaned = filename.replaceAll("\\", "/").replace(/^\/+/, "")
  if (cleaned.includes("..")) return null
  const resolved = path.resolve(dir, cleaned)
  if (!resolved.startsWith(dir + path.sep) && resolved !== dir) return null
  return resolved
}
