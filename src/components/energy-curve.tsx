import { PHASES, TRACKS, firstIndexOfPhase } from "@/lib/playlist"

export function EnergyCurve({
  current = -1,
  className = "",
}: {
  current?: number
  className?: string
}) {
  const width = 640
  const height = 56
  const max = TRACKS.length - 1
  const points = TRACKS.map((track, index) => {
    const x = max === 0 ? 0 : (index / max) * width
    const y = height - (track.energy / 10) * (height - 8) - 4
    return { x, y, energy: track.energy }
  })
  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ")
  const fill = `${path} L ${width} ${height} L 0 ${height} Z`
  const currentPoint = current >= 0 ? points[current] : null
  const phaseMarks = PHASES.map((phase) => {
    const index = firstIndexOfPhase(phase.id)
    return { id: phase.id, x: points[index]?.x ?? 0 }
  }).filter((mark) => mark.x > 0)

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label="Courbe d'énergie de la soirée, dans l’ordre de votre playlist YouTube"
    >
      {phaseMarks.map((mark) => (
        <line
          key={mark.id}
          x1={mark.x}
          x2={mark.x}
          y1="4"
          y2={height - 2}
          stroke="currentColor"
          className="text-primary/25"
          strokeWidth="1"
        />
      ))}
      <path d={fill} fill="currentColor" className="text-primary/15" />
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        className="text-primary"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {currentPoint ? (
        <circle
          cx={currentPoint.x}
          cy={currentPoint.y}
          r="5"
          className="fill-primary stroke-background"
          strokeWidth="2"
        />
      ) : null}
    </svg>
  )
}
