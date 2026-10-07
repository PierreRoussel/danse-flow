import { BalPlayer } from "@/components/bal-player"
import { scanMedia } from "@/lib/media-server"
import { indexFromTrackParam } from "@/lib/playlist"

export const dynamic = "force-dynamic"

export default async function BalPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>
}) {
  const { t } = await searchParams
  const library = await scanMedia()
  return <BalPlayer index={indexFromTrackParam(t)} library={library} />
}
