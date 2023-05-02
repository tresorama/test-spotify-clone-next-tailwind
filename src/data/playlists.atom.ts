import { atom } from "recoil";

export const playlistsAtom = atom<SpotifyApi.PlaylistObjectSimplified[]>({
  key: 'playlists',
  default: [],
});

export const selectedPlaylistIdAtom = atom<null | SpotifyApi.PlaylistObjectSimplified['id']>({
  key: 'selectedPlaylistId',
  default: null,
});