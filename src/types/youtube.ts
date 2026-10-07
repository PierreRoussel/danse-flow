export type YoutubePlayerInstance = {
  destroy: () => void
  playVideo: () => void
  pauseVideo: () => void
  getPlayerState: () => number
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement | string,
        options: {
          videoId?: string
          width?: string | number
          height?: string | number
          playerVars?: Record<string, string | number>
          events?: {
            onReady?: (event: { target: YoutubePlayerInstance }) => void
            onStateChange?: (event: {
              data: number
              target: YoutubePlayerInstance
            }) => void
            onError?: () => void
          }
        }
      ) => YoutubePlayerInstance
      PlayerState: {
        ENDED: number
        PLAYING: number
        PAUSED: number
      }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

export {}
