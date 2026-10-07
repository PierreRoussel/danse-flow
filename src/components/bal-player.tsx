"use client"

import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FolderOpen,
  PauseCircle,
  Play,
  Sparkles,
  TvMinimalPlay,
} from "lucide-react"

import { EnergyCurve } from "@/components/energy-curve"
import { LocalPlayer } from "@/components/local-player"
import { PlayerEffects } from "@/components/player-effects"
import { ResumeLink } from "@/components/resume-link"
import { YoutubeEmbed } from "@/components/youtube-embed"
import { YoutubeExportButton, PLAYLIST_FILE_HREF } from "@/components/youtube-export"
import { mediaByTrackId, type MediaLibrary } from "@/lib/media"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  firstIndexOfPhase,
  formatClock,
  formatLong,
  PHASES,
  phaseById,
  spotifySearchUrl,
  thumbnailUrl,
  TOTAL_DURATION,
  TRACKS,
  trackHref,
  trackHrefById,
  YOUTUBE_MUSIC_PLAYLIST_URL,
  youtubeMusicWatchUrl,
  youtubeWatchUrl,
  type Track,
} from "@/lib/playlist"
import { cn } from "@/lib/utils"

const RESCUES: { label: string; trackId: string; hint: string }[] = [
  { label: "La piste est molle", trackId: "september", hint: "September" },
  { label: "Il faut du français", trackId: "alors-on-danse", hint: "Alors on danse" },
  { label: "Les parents s’asseyent", trackId: "billie-jean", hint: "Billie Jean" },
  { label: "On respire", trackId: "je-te-promets", hint: "Johnny" },
  { label: "C’est l’heure du clou", trackId: "connemara", hint: "Connemara" },
]

export function BalLanding({ library }: { library: MediaLibrary }) {
  const localReady = library.matched.length
  return (
    <div className="relative min-h-full overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.34_0.07_42)_0%,_transparent_52%)]" />
      <main className="relative mx-auto flex min-h-full max-w-5xl flex-col justify-center gap-10 px-5 py-12 sm:px-8">
        <div className="space-y-4">
          <p className="text-[0.75rem] tracking-[0.32em] text-primary uppercase">
            Après le vin d’honneur et le repas
          </p>
          <h1 className="font-heading max-w-3xl text-5xl leading-[0.95] font-semibold tracking-tight sm:text-7xl">
            Ordinary, puis on emmène tout le monde.
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Vous ouvrez le bal avec votre femme. Déposez les MP3 dans le dossier{" "}
            <span className="text-foreground">musique/</span> : YouTube s’arrête et le
            lecteur joue vos fichiers. Quarante-trois titres, Connemara seulement quand
            c’est mérité.
          </p>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs tracking-[0.2em] text-primary/80 uppercase">
            <span>Énergie de la nuit</span>
            <span>
              {TRACKS.length} titres · {formatLong(TOTAL_DURATION)}
            </span>
          </div>
          <EnergyCurve className="h-16 w-full text-primary" />
        </div>

        <ol className="grid gap-3 sm:grid-cols-2">
          {PHASES.map((phase, i) => (
            <li
              key={phase.id}
              className="rounded-2xl border border-border/60 bg-card/40 p-4"
            >
              <p className="text-[0.65rem] tracking-[0.2em] text-primary uppercase">
                {String(i + 1).padStart(2, "0")} · {phase.clock}
              </p>
              <p className="font-heading mt-1 text-xl">{phase.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {phase.intent}
              </p>
            </li>
          ))}
        </ol>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={trackHref(0)}
            className={cn(buttonVariants({ size: "lg" }), "h-12 px-6 text-base")}
          >
            <Play />
            Ouvrir le bal
          </a>
          <ResumeLink />
          <a
            href="/mp3"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-12")}
          >
            <FolderOpen />
            MP3 · {localReady}/{TRACKS.length}
          </a>
          <a
            href={YOUTUBE_MUSIC_PLAYLIST_URL}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ size: "lg", variant: "ghost" }), "h-12")}
          >
            <TvMinimalPlay />
            YouTube Music
          </a>
          <YoutubeExportButton size="lg" variant="ghost" className="h-12" />
          <a
            href={PLAYLIST_FILE_HREF}
            download="le-bal-mariage.txt"
            className={cn(buttonVariants({ size: "lg", variant: "ghost" }), "h-12")}
          >
            Télécharger la liste
          </a>
        </div>

        <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
          <li className="rounded-xl border border-border/50 p-3">
            Copiez vos MP3 dans le dossier musique/, ouvrez la page MP3 pour vérifier les correspondances, puis lancez le bal.
          </li>
          <li className="rounded-xl border border-border/50 p-3">
            Après Ordinary, ne sautez pas aux bangers. Trois slows, puis September.
          </li>
          <li className="rounded-xl border border-border/50 p-3">
            Les Lacs du Connemara : jamais avant que la salle soit déjà chaude.
          </li>
        </ul>
      </main>
    </div>
  )
}

export function BalPlayer({
  index,
  library,
}: {
  index: number
  library: MediaLibrary
}) {
  const track = TRACKS[index]
  const phase = phaseById(track.phase)
  const nextTracks = TRACKS.slice(index + 1, index + 4)
  const elapsed = TRACKS.slice(0, index).reduce((sum, item) => sum + item.durationSec, 0)
  const prevHref = index > 0 ? trackHref(index - 1) : null
  const nextHref = index < TRACKS.length - 1 ? trackHref(index + 1) : null
  const mediaMap = mediaByTrackId(library)
  const local = mediaMap[track.id]
  const hasAnyLocal = library.matched.length > 0
  const matchedIds = library.matched.map((item) => item.trackId)

  return (
    <div className="min-h-full bg-background text-foreground print:hidden">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.32_0.06_40)_0%,_transparent_55%)]" />
      <div className="relative mx-auto flex min-h-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[0.7rem] tracking-[0.28em] text-primary/80 uppercase">
              Soirée de mariage
            </p>
            <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              <Link href="/" className="hover:text-primary">
                Le Bal
              </Link>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-primary/30 text-primary">
              {index + 1} / {TRACKS.length}
            </Badge>
            <Badge variant="secondary">
              {formatLong(elapsed)} écoulées · {formatLong(TOTAL_DURATION)} en tout
            </Badge>
            <a href="/mp3" className={buttonVariants({ variant: "outline", size: "sm" })}>
              <FolderOpen />
              MP3 · {library.matched.length}/{TRACKS.length}
            </a>
            <PlayerEffects
              index={index}
              nextHref={nextHref}
              prevHref={prevHref}
            />
          </div>
        </header>

        <p className="rounded-2xl border border-primary/25 bg-primary/8 px-4 py-3 text-sm leading-relaxed">
          {hasAnyLocal ? (
            local ? (
              <>
                Lecture MP3 : <span className="font-medium text-primary">{local.filename}</span>
                . YouTube est coupé sur ce titre.
              </>
            ) : (
              <>
                Pas de MP3 pour ce titre. Ajoutez-le dans{" "}
                <span className="text-foreground">musique/</span> ou ouvrez{" "}
                <a href="/mp3" className="font-medium text-primary underline-offset-2 hover:underline">
                  la liste des fichiers
                </a>
                .
              </>
            )
          ) : (
            <>
              Aucun MP3 pour l’instant. Déposez les fichiers dans{" "}
              <span className="text-foreground">musique/</span>, puis rechargez. En attendant,
              le lecteur YouTube reste actif.
            </>
          )}
        </p>

        <EnergyCurve current={index} className="h-12 w-full text-primary" />

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {PHASES.map((item) => {
            const active = item.id === track.phase
            return (
              <a
                key={item.id}
                href={trackHref(firstIndexOfPhase(item.id))}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-left text-xs transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/80 bg-card/60 text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="block font-medium">{item.label}</span>
                <span className="opacity-80">{item.clock}</span>
              </a>
            )
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          {RESCUES.map((rescue) => (
            <a
              key={rescue.trackId}
              href={trackHrefById(rescue.trackId)}
              className={buttonVariants({ variant: "secondary", size: "sm" })}
            >
              {rescue.label}
              <span className="text-muted-foreground">· {rescue.hint}</span>
            </a>
          ))}
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
          <section className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-primary/20 bg-card/80 shadow-[0_30px_80px_-40px_oklch(0.4_0.08_40)]">
              <div
                className="relative aspect-video bg-black"
                suppressHydrationWarning
              >
                {local ? (
                  <LocalPlayer track={track} media={local} nextHref={nextHref} />
                ) : hasAnyLocal ? (
                  <MissingEmbed track={track} missingFile />
                ) : track.youtubeId ? (
                  <YoutubeEmbed
                    videoId={track.youtubeId}
                    title={`${track.title} — ${track.artist}`}
                    index={index}
                    nextHref={nextHref}
                  />
                ) : (
                  <MissingEmbed track={track} />
                )}
              </div>
              <div className="space-y-4 p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[0.7rem] tracking-[0.22em] text-primary uppercase">
                      {phase.label}
                    </p>
                    <h2 className="font-heading text-3xl leading-tight sm:text-4xl">
                      {track.title}
                    </h2>
                    <p className="mt-1 text-muted-foreground">
                      {track.artist} · {track.year} · {formatClock(track.durationSec)}
                    </p>
                  </div>
                  <EnergyPips value={track.energy} />
                </div>
                <p className="rounded-2xl bg-primary/8 px-4 py-3 text-sm leading-relaxed">
                  <span className="font-medium text-primary">Consigne · </span>
                  {track.cue}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {track.why}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {prevHref ? (
                    <a href={prevHref} className={buttonVariants({ size: "lg" })}>
                      <ChevronLeft />
                      Précédent
                    </a>
                  ) : (
                    <span
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "pointer-events-none opacity-50"
                      )}
                    >
                      <ChevronLeft />
                      Précédent
                    </span>
                  )}
                  {nextHref ? (
                    <a href={nextHref} className={buttonVariants({ size: "lg" })}>
                      Suivant
                      <ChevronRight />
                    </a>
                  ) : (
                    <span
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "pointer-events-none opacity-50"
                      )}
                    >
                      Suivant
                      <ChevronRight />
                    </span>
                  )}
                  <a
                    href={youtubeMusicWatchUrl(track)}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    <TvMinimalPlay />
                    YouTube Music
                  </a>
                  <a
                    href={youtubeWatchUrl(track)}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonVariants({ variant: "ghost" })}
                  >
                    YouTube
                  </a>
                  <a
                    href={spotifySearchUrl(track)}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    <ExternalLink />
                    Spotify
                  </a>
                </div>
              </div>
            </div>

            {nextTracks.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-3">
                {nextTracks.map((item, offset) => (
                  <a
                    key={item.id}
                    href={trackHref(index + offset + 1)}
                    className="rounded-2xl border border-border/70 bg-card/50 p-4 text-left transition-colors hover:border-primary/40"
                  >
                    <p className="text-[0.65rem] tracking-[0.18em] text-primary/80 uppercase">
                      Ensuite {offset + 1}
                    </p>
                    <p className="font-heading mt-1 text-lg leading-tight">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.artist}</p>
                  </a>
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-primary/30 p-4 text-sm text-muted-foreground">
                Fin du bal. Mutter, puis les lumières — ou coupez après Don’t Stop Believin’
                si la salle a déjà donné.
              </p>
            )}
          </section>

          <aside className="hidden lg:block">
            <TrackList index={index} matchedIds={matchedIds} />
          </aside>
        </div>

        <details className="rounded-2xl border border-border/70 bg-card/40 lg:hidden">
          <summary className={cn(buttonVariants({ size: "lg" }), "w-full cursor-pointer")}>
            Voir toute la playlist
          </summary>
          <TrackList
            index={index}
            matchedIds={matchedIds}
            className="mt-0 h-auto max-h-[70vh] border-0"
          />
        </details>
      </div>
      <PrintSetlist current={index} />
    </div>
  )
}

function TrackList({
  index,
  matchedIds,
  className,
}: {
  index: number
  matchedIds: string[]
  className?: string
}) {
  return (
    <div
      className={cn(
        "h-[min(78vh,52rem)] overflow-y-auto rounded-3xl border border-border/70 bg-card/40",
        className
      )}
    >
      <div className="p-2">
        {PHASES.map((phase) => {
          const tracks = TRACKS.map((track, trackIndex) => ({ track, trackIndex })).filter(
            ({ track }) => track.phase === phase.id
          )
          return (
            <div key={phase.id} className="mb-3">
              <p className="px-3 pt-3 pb-1 text-[0.65rem] tracking-[0.22em] text-primary uppercase">
                {phase.label}
              </p>
              {tracks.map(({ track, trackIndex }) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  number={trackIndex + 1}
                  active={trackIndex === index}
                  href={trackHref(trackIndex)}
                  local={matchedIds.includes(track.id)}
                />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TrackRow({
  track,
  number,
  active,
  href,
  local,
}: {
  track: Track
  number: number
  active: boolean
  href: string
  local: boolean
}) {
  const thumb = thumbnailUrl(track)
  return (
    <a
      href={href}
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
        <span className="block truncate text-xs text-muted-foreground">
          {track.artist}
        </span>
      </span>
      <span
        className={cn(
          "text-xs tabular-nums",
          local ? "text-primary" : "text-muted-foreground"
        )}
      >
        {local ? "MP3" : formatClock(track.durationSec)}
      </span>
    </a>
  )
}

function MissingEmbed({
  track,
  missingFile = false,
}: {
  track: Track
  missingFile?: boolean
}) {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-4 bg-[linear-gradient(160deg,oklch(0.22_0.04_40),oklch(0.14_0.02_30))] p-6 text-center">
      <PauseCircle className="size-12 text-primary" />
      <div>
        <p className="font-heading text-2xl">{track.title}</p>
        <p className="text-muted-foreground">{track.artist}</p>
      </div>
      <p className="max-w-sm text-sm text-muted-foreground">
        {missingFile
          ? "Pas de MP3 pour ce titre : YouTube ne se lance pas. Ajoutez le fichier dans musique/, ou ouvrez YouTube Music en secours."
          : "Lancez ce titre dans YouTube Music, puis revenez ici pour enchaîner."}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <a
          href={youtubeMusicWatchUrl(track)}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants()}
        >
          <TvMinimalPlay />
          YouTube Music
        </a>
        <a
          href={youtubeWatchUrl(track)}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ variant: "outline" })}
        >
          YouTube
        </a>
      </div>
    </div>
  )
}

function EnergyPips({ value }: { value: number }) {
  return (
    <div className="flex items-end gap-1" aria-label={`Énergie ${value} sur 10`}>
      {Array.from({ length: 10 }, (_, i) => (
        <span
          key={i}
          className={cn("w-1.5 rounded-full", i < value ? "bg-primary" : "bg-muted")}
          style={{ height: `${8 + i * 2}px` }}
        />
      ))}
    </div>
  )
}

function PrintSetlist({ current }: { current: number }) {
  return (
    <div className="hidden print:block">
      <h1 className="font-heading mb-2 text-4xl">Le Bal — setlist</h1>
      <p className="mb-6 text-sm">
        {TRACKS.length} titres · {formatLong(TOTAL_DURATION)} · en cours : {TRACKS[current].title}
      </p>
      {PHASES.map((phase) => (
        <section key={phase.id} className="mb-4">
          <h2 className="text-lg font-semibold">
            {phase.label} · {phase.clock}
          </h2>
          <ol className="pl-5">
            {TRACKS.filter((track) => track.phase === phase.id).map((track) => (
              <li key={track.id}>
                {track.title} — {track.artist}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}
