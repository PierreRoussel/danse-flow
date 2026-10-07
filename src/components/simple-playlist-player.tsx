"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FolderOpen,
  PauseCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react"

import { LocalPlayer, PauseLocalMedia } from "@/components/local-player"
import { PlayerEffects } from "@/components/player-effects"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { mediaByTrackId, type MediaLibrary } from "@/lib/media"
import {
  formatClock,
  spotifySearchUrl,
  thumbnailUrl,
  youtubeMusicWatchUrl,
} from "@/lib/playlist"
import {
  nextEveningPlaylist,
  playlistEntryHref,
  trackHrefForPlaylist,
  type PlaylistDef,
  type PlaylistSlug,
} from "@/lib/playlists"
import { startTrackMedia } from "@/lib/shared-media"
import type { SimpleTrack } from "@/data/extra-playlists"
import { cn } from "@/lib/utils"

export function SimplePlaylistPlayer({
  playlist,
  index,
  library,
}: {
  playlist: PlaylistDef
  index: number
  library: MediaLibrary
}) {
  const router = useRouter()
  const slug = playlist.slug as PlaylistSlug
  const tracks = playlist.tracks as SimpleTrack[]
  const track = tracks[index]
  const nextIndex = tracks.length > 0 ? (index + 1) % tracks.length : 0
  const prevIndex =
    tracks.length > 0 ? (index - 1 + tracks.length) % tracks.length : 0
  const nextHref = trackHrefForPlaylist(slug, nextIndex)
  const prevHref = trackHrefForPlaylist(slug, prevIndex)
  const mediaMap = mediaByTrackId(library)
  const local = mediaMap[track.id]
  const nextMedia = mediaMap[tracks[nextIndex]?.id]
  const matchedIds = library.matched.map((item) => item.trackId)
  const nextStage = nextEveningPlaylist(slug)

  function cue(targetIndex: number, forceRestart = false) {
    const clamped = Math.min(Math.max(targetIndex, 0), tracks.length - 1)
    const target = tracks[clamped]
    void startTrackMedia(mediaMap[target.id], {
      startAtSec: target.startAtSec ?? 0,
      forceRestart,
    })
  }

  function goTo(targetIndex: number) {
    cue(targetIndex, true)
    router.push(trackHrefForPlaylist(slug, targetIndex), { scroll: false })
  }

  function relaunch() {
    cue(index, true)
  }

  return (
    <div className="min-h-full bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.32_0.06_40)_0%,_transparent_55%)]" />

      <aside className="pointer-events-none fixed inset-y-0 left-0 z-30 hidden w-40 xl:block 2xl:w-44">
        <Link
          href="/"
          className="pointer-events-auto group absolute top-1/2 left-0 flex min-h-28 w-full -translate-y-1/2 flex-col items-center justify-center gap-2 border-y border-r border-primary/20 bg-background/40 px-3 py-6 text-center text-muted-foreground backdrop-blur-md transition-colors hover:border-primary/45 hover:bg-primary/8 hover:text-primary"
        >
          <ChevronLeft className="size-5 opacity-50 transition-transform group-hover:-translate-x-0.5 group-hover:opacity-100" />
          <span className="font-heading text-base leading-snug tracking-[0.18em] uppercase 2xl:text-lg">
            Menu principal
          </span>
        </Link>
      </aside>

      {nextStage ? (
        <aside className="pointer-events-none fixed inset-y-0 right-0 z-30 hidden w-40 xl:block 2xl:w-44">
          <Link
            href={playlistEntryHref(nextStage.slug)}
            className="pointer-events-auto group absolute top-1/2 right-0 flex min-h-28 w-full -translate-y-1/2 flex-col items-center justify-center gap-2 border-y border-l border-primary/20 bg-background/40 px-3 py-6 text-center text-muted-foreground backdrop-blur-md transition-colors hover:border-primary/45 hover:bg-primary/8 hover:text-primary"
          >
            <span className="font-heading text-base leading-snug tracking-[0.18em] uppercase 2xl:text-lg">
              {nextStage.title}
            </span>
            <ChevronRight className="size-5 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" />
          </Link>
        </aside>
      ) : null}

      <div className="relative mx-auto flex min-h-full max-w-5xl flex-col gap-6 px-4 py-5 sm:px-6 xl:px-44 2xl:px-48">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[0.7rem] tracking-[0.28em] text-primary/80 uppercase">
              Playlist simple · MP3 local
            </p>
            <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              <Link href="/" className="hover:text-primary">
                {playlist.title}
              </Link>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-primary/30 text-primary">
              {index + 1} / {tracks.length}
            </Badge>
            <Link
              href="/"
              className={cn(
                "xl:hidden",
                "inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 text-xs tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:border-primary/40 hover:text-primary"
              )}
            >
              <ChevronLeft className="size-3.5" />
              Menu
            </Link>
            {nextStage ? (
              <Link
                href={playlistEntryHref(nextStage.slug)}
                className={cn(
                  "xl:hidden",
                  "inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs tracking-[0.14em] text-primary uppercase transition-colors hover:bg-primary/18"
                )}
              >
                {nextStage.title}
                <ChevronRight className="size-3.5" />
              </Link>
            ) : null}
            <Link
              href={`/mp3?playlist=${slug}`}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <FolderOpen />
              MP3 · {library.matched.length}/{tracks.length}
            </Link>
            <PlayerEffects
              slug={slug}
              index={index}
              tracks={tracks}
              onNext={() => goTo(nextIndex)}
              onPrev={() => goTo(prevIndex)}
            />
          </div>
        </header>

        <p className="rounded-2xl border border-border/70 bg-card/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          {local ? (
            <>
              Lecture :{" "}
              <span className="font-medium text-primary">{local.filename}</span>
            </>
          ) : (
            <>
              MP3 manquant pour ce titre. Ajoutez le fichier dans{" "}
              <code className="text-foreground">
                musique/{playlist.mediaSubdir}/
              </code>{" "}
              ou consultez{" "}
              <Link href={`/mp3?playlist=${slug}`} className="text-primary underline-offset-2 hover:underline">
                la liste des fichiers
              </Link>
              .
            </>
          )}
        </p>

        <div
          className={cn(
            "grid items-start gap-6",
            tracks.length > 1 &&
              "lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)]"
          )}
        >
          <section className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-primary/20 bg-card/80 shadow-[0_30px_80px_-40px_oklch(0.4_0.08_40)]">
              <div className="relative aspect-video bg-black" suppressHydrationWarning>
                {local ? (
                  <LocalPlayer
                    track={track}
                    media={local}
                    nextMedia={nextMedia}
                    startAtSec={track.startAtSec ?? 0}
                    nextStartAtSec={tracks[nextIndex]?.startAtSec ?? 0}
                    onAdvance={() => goTo(nextIndex)}
                  />
                ) : (
                  <MissingMp3 track={track} subdir={playlist.mediaSubdir} />
                )}
              </div>
              <div className="space-y-4 p-5 sm:p-6">
                <div>
                  <h2 className="font-heading text-3xl leading-tight sm:text-4xl">
                    {track.title}
                  </h2>
                  <p className="mt-1 text-muted-foreground">
                    {track.artist}
                    {track.startAtSec
                      ? ` · à partir de ${formatClock(track.startAtSec)}`
                      : local?.kind === "video"
                        ? " · vidéo locale"
                        : ` · ${formatClock(track.durationSec)}`}
                  </p>
                </div>
                {local && (track.startAtSec != null || tracks.length === 1) ? (
                  <button
                    type="button"
                    onClick={relaunch}
                    className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
                  >
                    <RotateCcw />
                    Re-lancer
                  </button>
                ) : null}
                {tracks.length > 1 ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={prevHref}
                      scroll={false}
                      onClick={() => cue(prevIndex, true)}
                      className={buttonVariants({ size: "lg" })}
                    >
                      <ChevronLeft />
                      Précédent
                    </Link>
                    <Link
                      href={nextHref}
                      scroll={false}
                      onClick={() => cue(nextIndex, true)}
                      className={buttonVariants({ size: "lg" })}
                    >
                      Suivant
                      <ChevronRight />
                    </Link>
                    <a
                      href={youtubeMusicWatchUrl(track)}
                      target="_blank"
                      rel="noreferrer"
                      className={buttonVariants({ variant: "outline" })}
                    >
                      YouTube Music
                      <ExternalLink className="size-3.5 opacity-60" />
                    </a>
                    <a
                      href={spotifySearchUrl(track)}
                      target="_blank"
                      rel="noreferrer"
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      Spotify
                      <ExternalLink className="size-3.5 opacity-60" />
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          {tracks.length > 1 ? (
            <aside className="h-[min(70vh,40rem)] overflow-y-auto rounded-3xl border border-border/70 bg-card/40 p-2">
              {tracks.map((item, trackIndex) => (
                <TrackRow
                  key={item.id}
                  track={item}
                  number={trackIndex + 1}
                  active={trackIndex === index}
                  href={trackHrefForPlaylist(slug, trackIndex)}
                  onCue={() => cue(trackIndex, true)}
                  local={matchedIds.includes(item.id)}
                />
              ))}
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function TrackRow({
  track,
  number,
  active,
  href,
  onCue,
  local,
}: {
  track: SimpleTrack
  number: number
  active: boolean
  href: string
  onCue: () => void
  local: boolean
}) {
  const thumb = thumbnailUrl(track)
  return (
    <Link
      href={href}
      scroll={false}
      onClick={onCue}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors",
        active ? "bg-primary/15" : "hover:bg-muted/60"
      )}
    >
      <span className="w-6 text-right text-xs tabular-nums text-muted-foreground">
        {number}
      </span>
      {thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumb} alt="" className="size-10 rounded-md object-cover" />
      ) : (
        <span className="bg-muted flex size-10 items-center justify-center rounded-md">
          <Sparkles className="size-4 text-primary" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{track.title}</span>
        <span className="block truncate text-xs text-muted-foreground">{track.artist}</span>
      </span>
      <span
        className={cn(
          "text-xs tabular-nums",
          local ? "text-primary" : "text-muted-foreground"
        )}
      >
        {local ? "MP3" : formatClock(track.durationSec)}
      </span>
    </Link>
  )
}

function MissingMp3({
  track,
  subdir,
}: {
  track: SimpleTrack
  subdir: string
}) {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-4 bg-[linear-gradient(160deg,oklch(0.22_0.04_40),oklch(0.14_0.02_30))] p-6 text-center">
      <PauseLocalMedia />
      <PauseCircle className="size-12 text-primary" />
      <div>
        <p className="font-heading text-2xl">{track.title}</p>
        <p className="text-muted-foreground">{track.artist}</p>
      </div>
      <p className="max-w-sm text-sm text-muted-foreground">
        Aucun fichier local pour ce titre. Déposez un MP3 dans{" "}
        <code className="text-foreground">musique/{subdir}/</code>, rechargez, ou passez au
        suivant.
      </p>
    </div>
  )
}
