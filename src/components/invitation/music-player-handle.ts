export type MusicPlayerHandle = {
  /** Call synchronously inside a user click/tap handler for reliable autoplay. */
  playFromUserGesture: () => void;
};
