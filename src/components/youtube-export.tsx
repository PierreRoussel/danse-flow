"use client"

import Link from "next/link"
import { ArrowLeft, Download, ExternalLink } from "lucide-react"

import { CopyButton } from "@/components/copy-button"
import { buttonVariants } from "@/components/ui/button"
import {
  exportSongLines,
  TRACKS,
  YOUTUBE_MUSIC_PLAYLIST_URL,
  youtubeMusicWatchUrl,
} from "@/lib/playlist"
import { cn } from "@/lib/utils"

export const PLAYLIST_FILE_HREF = "/api/le-bal"

export function YoutubeExportButton({
  size = "lg",
  variant = "outline",
  className,
}: {
  size?: "sm" | "lg"
  variant?: "outline" | "ghost" | "secondary"
  className?: string
}) {
  return (
    <Link
      href="/youtube"
      className={cn(buttonVariants({ variant, size }), className)}
    >
      <Download />
      Hors ligne
    </Link>
  )
}

export function YoutubeExportPanel() {
  const songLines = exportSongLines()

  return (
    <div className="relative min-h-full overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.34_0.07_42)_0%,_transparent_52%)]" />
      <main className="relative mx-auto flex min-h-full max-w-2xl flex-col gap-8 px-5 py-10 sm:px-8">
        <div>
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Retour au bal
          </Link>
          <p className="text-[0.75rem] tracking-[0.32em] text-primary uppercase">
            YouTube Music
          </p>
          <h1 className="font-heading mt-2 text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
            Jouer hors ligne le soir J
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            YouTube n’autorise pas une autre appli à lire votre bibliothèque hors ligne.
            Le téléchargement officiel se fait dans YouTube Music Premium. Cette console
            reste le pupitre : YouTube Music sort le son.
          </p>
        </div>

        <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5">
          <p className="font-medium text-primary">Ouvrir Mariage (soirée)</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Même playlist que la console, {TRACKS.length} titres, Ordinary en premier.
          </p>
          <a
            href={YOUTUBE_MUSIC_PLAYLIST_URL}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ size: "lg" }), "mt-4")}
          >
            <ExternalLink />
            Ouvrir dans YouTube Music
          </a>
        </div>

        <ol className="space-y-4">
          <li className="rounded-2xl border border-border/70 bg-card/40 p-5">
            <p className="text-[0.65rem] tracking-[0.2em] text-primary uppercase">
              Étape 1
            </p>
            <p className="mt-1 font-heading text-2xl">Premium, sur l’appareil de la sono</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Téléphone, tablette ou ordi qui sera branché aux enceintes. Connectez-vous
              au compte YouTube Music Premium (sans Premium, pas de téléchargement et des
              pubs au milieu d’Ordinary).
            </p>
          </li>
          <li className="rounded-2xl border border-border/70 bg-card/40 p-5">
            <p className="text-[0.65rem] tracking-[0.2em] text-primary uppercase">
              Étape 2
            </p>
            <p className="mt-1 font-heading text-2xl">Télécharger la playlist</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Dans YouTube Music, ouvrez « Mariage (soirée) », puis l’icône de
              téléchargement (ou ⋮ puis Télécharger). Attendez que les {TRACKS.length}{" "}
              titres soient bien enregistrés. Faites-le à la maison, pas le jour J.
            </p>
          </li>
          <li className="rounded-2xl border border-border/70 bg-card/40 p-5">
            <p className="text-[0.65rem] tracking-[0.2em] text-primary uppercase">
              Étape 3
            </p>
            <p className="mt-1 font-heading text-2xl">Le soir, deux écrans</p>
            <p className="mt-1 text-sm text-muted-foreground">
              YouTube Music joue Ordinary puis la suite, même sans wifi. Cette console
              (autre écran ou même ordi) dit quand sauter : piste molle, français,
              Connemara. Chaque bouton « YouTube Music » ouvre le bon titre dans la
              playlist.
            </p>
          </li>
        </ol>

        <div className="rounded-2xl border border-border/70 bg-card/40 p-5">
          <p className="text-[0.65rem] tracking-[0.2em] text-primary uppercase">
            Copie de secours
          </p>
          <p className="mt-1 font-heading text-2xl">Les titres, à coller ailleurs</p>
          <textarea
            id="le-bal-songs"
            readOnly
            defaultValue={songLines}
            className="mt-4 h-48 w-full resize-y rounded-xl border border-border bg-background p-3 font-mono text-xs leading-relaxed text-foreground"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <CopyButton text={songLines} selectId="le-bal-songs" />
            <a
              href={PLAYLIST_FILE_HREF}
              download="le-bal-mariage.txt"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              <Download />
              Télécharger en .txt
            </a>
          </div>
        </div>

        <section>
          <h2 className="font-heading text-2xl">Ouvrir un titre</h2>
          <p className="mt-1 mb-3 text-sm text-muted-foreground">
            Chaque ligne lance le morceau dans YouTube Music, dans votre playlist.
          </p>
          <ol className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/70 bg-card/40">
            {TRACKS.map((track, index) => (
              <li key={track.id}>
                <a
                  href={youtubeMusicWatchUrl(track)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-baseline gap-3 px-4 py-3 text-sm hover:bg-muted/50"
                >
                  <span className="w-6 shrink-0 text-right tabular-nums text-muted-foreground">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-medium">{track.title}</span>
                    <span className="text-muted-foreground"> — {track.artist}</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  )
}
