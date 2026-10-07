import { promises as fs } from "node:fs"
import path from "node:path"

import { isMediaFilename, matchMediaFiles, type MediaLibrary } from "@/lib/media"

export function mediaDir() {
  return process.env.LE_BAL_MEDIA_DIR || path.join(process.cwd(), "musique")
}

async function listFiles(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const names: string[] = []
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        const nested = await fs.readdir(full, { withFileTypes: true })
        for (const child of nested) {
          if (child.isFile() && isMediaFilename(child.name)) {
            names.push(`${entry.name}/${child.name}`)
          }
        }
      } else if (entry.isFile() && isMediaFilename(entry.name)) {
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

export async function scanMedia(): Promise<MediaLibrary> {
  const dir = mediaDir()
  await fs.mkdir(dir, { recursive: true })
  const files = await listFiles(dir)
  const overrides = await readOverrides(dir)
  return matchMediaFiles(files, overrides)
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
