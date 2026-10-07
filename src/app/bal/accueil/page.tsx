import { BalLanding } from "@/components/bal-player"
import { scanMediaForPlaylist } from "@/lib/media-server"

export const dynamic = "force-dynamic"

export default async function BalAccueilPage() {
  const library = await scanMediaForPlaylist("bal")
  return <BalLanding library={library} />
}
