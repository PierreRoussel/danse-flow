import Link from "next/link"
import { ChevronRight, Music2, Sparkles } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  PLAYLISTS,
  playlistHubHref,
  playlistPlayerHref,
  totalDurationSec,
  type PlaylistSlug,
} from "@/lib/playlists"
import { formatLong } from "@/lib/playlist"
import { cn } from "@/lib/utils"

export function PlaylistHub() {
  return (
    <div className="relative min-h-full overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.34_0.07_42)_0%,_transparent_52%)]" />
      <main className="relative mx-auto flex min-h-full max-w-3xl flex-col justify-center gap-10 px-5 py-12 sm:px-8">
        <div className="space-y-3">
          <p className="text-[0.75rem] tracking-[0.32em] text-primary uppercase">
            Le Bal · pupitre multi-playlists
          </p>
          <h1 className="font-heading text-5xl leading-[0.95] font-semibold tracking-tight sm:text-6xl">
            Choisissez une playlist
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            Lecture locale uniquement : déposez vos MP3 dans{" "}
            <span className="text-foreground">musique/</span> (ou le sous-dossier de la
            playlist), puis lancez la lecture.
          </p>
        </div>

        <ul className="grid gap-4">
          {PLAYLISTS.map((playlist) => (
            <li key={playlist.slug}>
              <PlaylistCard slug={playlist.slug} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

function PlaylistCard({ slug }: { slug: PlaylistSlug }) {
  const playlist = PLAYLISTS.find((item) => item.slug === slug)!
  const duration = formatLong(totalDurationSec(playlist.tracks))
  const isFull = playlist.mode === "full"

  return (
    <article className="rounded-2xl border border-border/70 bg-card/40 p-5 transition-colors hover:border-primary/35">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            {isFull ? (
              <Sparkles className="size-4 text-primary" aria-hidden />
            ) : (
              <Music2 className="size-4 text-primary" aria-hidden />
            )}
            <h2 className="font-heading text-2xl font-semibold">{playlist.title}</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{playlist.tagline}</p>
          <p className="text-xs text-muted-foreground">
            {playlist.tracks.length} titres · {duration}
            {playlist.mediaSubdir ? (
              <>
                {" "}
                · dossier{" "}
                <code className="text-foreground">musique/{playlist.mediaSubdir}/</code>
              </>
            ) : (
              <> · dossier racine <code className="text-foreground">musique/</code></>
            )}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Link
            href={
              isFull
                ? playlistHubHref(slug)
                : playlistPlayerHref(slug, playlist.tracks[0]?.id)
            }
            className={cn(buttonVariants(), "h-10")}
          >
            {isFull ? "Ouvrir le bal" : "Lancer"}
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}
