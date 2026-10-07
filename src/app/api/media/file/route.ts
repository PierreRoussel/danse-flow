import { createReadStream } from "node:fs"
import { stat } from "node:fs/promises"
import { Readable } from "node:stream"

import { mimeFor, resolveMediaPath } from "@/lib/media-server"

export const dynamic = "force-dynamic"

function parseRange(header: string | null, size: number) {
  if (!header?.startsWith("bytes=")) return null
  const [startRaw, endRaw] = header.slice(6).split("-", 2)
  const start = startRaw ? Number(startRaw) : NaN
  const end = endRaw ? Number(endRaw) : size - 1
  if (!Number.isFinite(start) || start < 0 || start >= size) return null
  const clampedEnd = Number.isFinite(end) ? Math.min(end, size - 1) : size - 1
  if (clampedEnd < start) return null
  return { start, end: clampedEnd }
}

export async function GET(request: Request) {
  const filename = new URL(request.url).searchParams.get("name")
  if (!filename) {
    return new Response("Nom de fichier manquant", { status: 400 })
  }

  const filePath = resolveMediaPath(filename)
  if (!filePath) {
    return new Response("Fichier interdit", { status: 400 })
  }

  try {
    const info = await stat(filePath)
    if (!info.isFile()) {
      return new Response("Introuvable", { status: 404 })
    }

    const size = info.size
    const range = parseRange(request.headers.get("range"), size)
    const type = mimeFor(filename)

    if (range) {
      const { start, end } = range
      const stream = Readable.toWeb(
        createReadStream(filePath, { start, end })
      ) as ReadableStream
      return new Response(stream, {
        status: 206,
        headers: {
          "Content-Type": type,
          "Content-Length": String(end - start + 1),
          "Content-Range": `bytes ${start}-${end}/${size}`,
          "Accept-Ranges": "bytes",
          "Cache-Control": "no-store",
        },
      })
    }

    const stream = Readable.toWeb(createReadStream(filePath)) as ReadableStream
    return new Response(stream, {
      headers: {
        "Content-Type": type,
        "Content-Length": String(size),
        "Accept-Ranges": "bytes",
        "Cache-Control": "no-store",
      },
    })
  } catch {
    return new Response("Introuvable", { status: 404 })
  }
}
