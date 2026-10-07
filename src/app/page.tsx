import { BalLanding } from "@/components/bal-player"
import { scanMedia } from "@/lib/media-server"

export const dynamic = "force-dynamic"

export default async function Page() {
  const library = await scanMedia()
  return <BalLanding library={library} />
}
