/** Titres légers pour les playlists hors « Le Bal » (MP3 dans musique/<dossier>/). */

export type SimpleTrack = {
  id: string
  title: string
  artist: string
  durationSec: number
  /** Démarre la lecture à ce décalage (secondes). */
  startAtSec?: number
  /** Vignette YouTube uniquement — pas de lecture intégrée. */
  youtubeId?: string
}

export const REPAS_TRACKS: SimpleTrack[] = [
  { id: "mamma-mia", title: "Mamma Mia", artist: "ABBA", durationSec: 240 },
  { id: "walls", title: "Walls", artist: "All Time Low", durationSec: 240 },
  {
    id: "fluorescent-adolescent",
    title: "Fluorescent Adolescent",
    artist: "Arctic Monkeys",
    durationSec: 240,
  },
  { id: "fire", title: "Fire", artist: "Barns Courtney", durationSec: 240 },
  { id: "the-scientist", title: "The Scientist", artist: "Coldplay", durationSec: 240 },
  {
    id: "thinking-out-loud",
    title: "Thinking out Loud",
    artist: "Ed Sheeran",
    durationSec: 240,
  },
  { id: "at-last", title: "At Last", artist: "Etta James", durationSec: 240 },
  { id: "centuries", title: "Centuries", artist: "Fall Out Boy", durationSec: 240 },
  {
    id: "my-songs-know-what-you-did-in-the-dark-light-em-up",
    title: "My Songs Know What You Did In The Dark (Light Em Up)",
    artist: "Fall Out Boy",
    durationSec: 240,
  },
  { id: "take-me-out", title: "Take Me Out", artist: "Franz Ferdinand", durationSec: 240 },
  {
    id: "awesome-mix-vol-1-2",
    title: "Awesome Mix Vol. 1 & 2",
    artist: "Guardians of the Galaxy",
    durationSec: 240,
  },
  {
    id: "heather-on-the-hill",
    title: "Heather On The Hill",
    artist: "Nathan Evans",
    durationSec: 240,
  },
  { id: "hotel-california", title: "Hotel California", artist: "Eagles", durationSec: 240 },
  {
    id: "i-put-a-spell-on-you",
    title: "I Put a Spell On You",
    artist: "IZA",
    durationSec: 240,
  },
  { id: "dream", title: "Dream", artist: "Imagine Dragons", durationSec: 240 },
  { id: "the-middle", title: "The Middle", artist: "Jimmy Eat World", durationSec: 240 },
  {
    id: "running-up-that-hill",
    title: "Running Up That Hill",
    artist: "Kate Bush",
    durationSec: 240,
  },
  {
    id: "kingdom-of-fear",
    title: "Kingdom of Fear",
    artist: "Cameron Whitcomb",
    durationSec: 240,
  },
  {
    id: "little-sister",
    title: "Little Sister",
    artist: "Jean-Philippe Verdin",
    durationSec: 240,
  },
  {
    id: "i-want-to-spend-my-lifetime-loving-you",
    title: "I Want to Spend My Lifetime Loving You",
    artist: "Marc Anthony, Tina Arena",
    durationSec: 240,
  },
  { id: "help-im-alive", title: "Help I'm Alive", artist: "Metric", durationSec: 240 },
  {
    id: "welcome-to-the-black-parade",
    title: "Welcome To The Black Parade",
    artist: "My Chemical Romance",
    durationSec: 240,
  },
  {
    id: "in-the-air-tonight",
    title: "In The Air Tonight",
    artist: "Phil Collins",
    durationSec: 240,
  },
  { id: "black-betty", title: "Black Betty", artist: "Ram Jam", durationSec: 240 },
  { id: "hit-the-road-jack", title: "Hit The Road Jack", artist: "Ray Charles", durationSec: 240 },
  { id: "otherside", title: "Otherside", artist: "Red Hot Chili Peppers", durationSec: 240 },
  { id: "turtle-island", title: "Turtle Island", artist: "Renee Christine", durationSec: 240 },
  { id: "alright", title: "Alright", artist: "Supergrass", durationSec: 240 },
  { id: "here-comes-the-sun", title: "Here Comes The Sun", artist: "The Beatles", durationSec: 240 },
  {
    id: "the-idea-of-you",
    title: "The Idea of You",
    artist: "Alfie Castley",
    durationSec: 240,
  },
  { id: "mr-brightside", title: "Mr. Brightside", artist: "The Killers", durationSec: 240 },
  { id: "somebody-told-me", title: "Somebody Told Me", artist: "The Killers", durationSec: 240 },
  { id: "future-starts-slow", title: "Future Starts Slow", artist: "The Kills", durationSec: 240 },
  {
    id: "youre-gonna-go-far-kid",
    title: "You're Gonna Go Far, Kid",
    artist: "The Offspring",
    durationSec: 240,
  },
  { id: "in-the-shadows", title: "In the Shadows", artist: "The Rasmus", durationSec: 240 },
  { id: "angel", title: "Angel", artist: "Theory of a Deadman", durationSec: 240 },
  { id: "guns-for-hire", title: "Guns For Hire", artist: "Woodkid", durationSec: 240 },
  { id: "run-boy-run", title: "Run Boy Run", artist: "Woodkid", durationSec: 240 },
  { id: "take-on-me", title: "Take On Me", artist: "a-ha", durationSec: 240 },
  {
    id: "dream-on",
    title: "Dream On",
    artist: "Blacktop Mojo",
    durationSec: 240,
  },
]

export const BLIND_TEST_TRACKS: SimpleTrack[] = [
  {
    id: "blind-test-video",
    title: "Blind test toutes générations",
    artist: "Film · série · TV · anime",
    durationSec: 3600,
  },
]

export const BASEBALL_GAME_TRACKS: SimpleTrack[] = [
  {
    id: "i-will-always-love-you",
    title: "I Will Always Love You",
    artist: "Céline Dion",
    durationSec: 280,
    /** Lecture à partir de 2:45 uniquement. */
    startAtSec: 2 * 60 + 45,
  },
]

/** Même set que le repas, ordre inversé (réutilise musique/repas/). */
export const GATEAU_TRACKS: SimpleTrack[] = [...REPAS_TRACKS].reverse()
