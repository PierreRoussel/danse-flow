import { notFound } from "next/navigation"

import { SimplePlaylistPlayer } from "@/components/simple-playlist-player"
import { scanMediaForPlaylist } from "@/lib/media-server"
import { getPlaylist, indexFromTrackParam, isPlaylistSlug } from "@/lib/playlists"

export const dynamic = "force-dynamic"

export default async function SimplePlaylistPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ t?: string }>
}) {
  const { slug } = await params
  if (!isPlaylistSlug(slug) || slug === "bal") {
    notFound()
  }
  const playlist = getPlaylist(slug)
  if (!playlist || playlist.mode !== "simple") {
    notFound()
  }
  const { t } = await searchParams
  const library = await scanMediaForPlaylist(slug)
  const index = indexFromTrackParam(playlist.tracks, t)

  return <SimplePlaylistPlayer playlist={playlist} index={index} library={library} />
}
