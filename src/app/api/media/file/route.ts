import { createReadStream } from "node:fs"
import { stat } from "node:fs/promises"
import { Readable } from "node:stream"

import { mimeFor, resolveMediaPath } from "@/lib/media-server"

export const dynamic = "force-dynamic"

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
    const stream = Readable.toWeb(createReadStream(filePath)) as ReadableStream
    return new Response(stream, {
      headers: {
        "Content-Type": mimeFor(filename),
        "Content-Length": String(info.size),
        "Accept-Ranges": "bytes",
        "Cache-Control": "no-store",
      },
    })
  } catch {
    return new Response("Introuvable", { status: 404 })
  }
}
