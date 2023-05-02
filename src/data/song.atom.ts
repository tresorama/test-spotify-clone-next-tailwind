import { atom } from "recoil";

export const playingTrackIdAtom = atom<
  null
  | {
    id: SpotifyApi.TrackObjectSimplified['id'],
    uri: SpotifyApi.TrackObjectSimplified['uri'],
  }>({
    key: 'playingTrackId',
    default: null,
  });

export const playStateAtom = atom<'idle' | 'playing' | 'paused'>({
  key: 'playState',
  default: 'idle',
});