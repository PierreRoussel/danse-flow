import { exportSongLines } from "@/lib/playlist"

export async function GET() {
  return new Response(exportSongLines(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'attachment; filename="le-bal-mariage.txt"',
      "Cache-Control": "no-store",
    },
  })
}
