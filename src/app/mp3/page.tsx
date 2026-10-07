import Link from "next/link"
import { ArrowLeft, FolderOpen } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { scanMedia } from "@/lib/media-server"
import { TRACKS, trackHrefById } from "@/lib/playlist"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function Mp3Page() {
  const library = await scanMedia()
  const byId = Object.fromEntries(library.matched.map((item) => [item.trackId, item]))

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
            Dossier musique
          </p>
          <h1 className="font-heading mt-2 text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
            Les MP3 de la soirée
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Déposez vos fichiers dans le dossier <code className="text-foreground">musique/</code>{" "}
            à la racine du projet, puis rechargez. Le lecteur coupe YouTube dès qu’un
            fichier est reconnu.
          </p>
        </div>

        <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5">
          <p className="flex items-center gap-2 font-medium text-primary">
            <FolderOpen className="size-4" />
            {library.matched.length} / {TRACKS.length} titres trouvés
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Noms qui marchent bien : <em>Ordinary.mp3</em>,{" "}
            <em>Alex Warren - Ordinary.mp3</em>, <em>01 Ordinary.mp3</em>, ou l’id YouTube{" "}
            <em>u2ah9tWTkmk.mp3</em>. En cas de doute, un fichier{" "}
            <code className="text-foreground">musique/correspondances.json</code> force
            l’association.
          </p>
          <Link href="/bal" className={cn(buttonVariants({ size: "lg" }), "mt-4")}>
            Ouvrir le bal
          </Link>
        </div>

        <section>
          <h2 className="font-heading text-2xl">Correspondances</h2>
          <ol className="mt-3 divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/70 bg-card/40">
            {TRACKS.map((track, index) => {
              const hit = byId[track.id]
              return (
                <li key={track.id} className="flex items-baseline gap-3 px-4 py-3 text-sm">
                  <span className="w-6 shrink-0 text-right tabular-nums text-muted-foreground">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <a href={trackHrefById(track.id)} className="font-medium hover:text-primary">
                      {track.title}
                    </a>
                    <span className="text-muted-foreground"> — {track.artist}</span>
                    <span
                      className={cn(
                        "mt-1 block truncate text-xs",
                        hit ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {hit ? hit.filename : "fichier manquant"}
                    </span>
                  </span>
                </li>
              )
            })}
          </ol>
        </section>

        {library.unmatchedFiles.length > 0 ? (
          <section>
            <h2 className="font-heading text-2xl">Fichiers non reconnus</h2>
            <p className="mt-1 mb-3 text-sm text-muted-foreground">
              Renommez-les, ou ajoutez-les dans correspondances.json.
            </p>
            <ul className="rounded-2xl border border-border/70 bg-card/40 px-4 py-3 text-sm">
              {library.unmatchedFiles.map((filename) => (
                <li key={filename} className="truncate py-1">
                  {filename}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
    </div>
  )
}
