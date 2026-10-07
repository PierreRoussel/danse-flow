import { scanMedia } from "@/lib/media-server"

export const dynamic = "force-dynamic"

export async function GET() {
  const library = await scanMedia()
  return Response.json(library, {
    headers: { "Cache-Control": "no-store" },
  })
}
