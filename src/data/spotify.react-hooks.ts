import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useSpotifyClient } from "../lib/spotify/spotify.helpers.react";
import { playlistsAtom } from "@/data/playlists.atom";

export const useUserPlaylists = () => {
  const spotifyClient = useSpotifyClient();
  const [playlists, setPlaylists] = useRecoilState<SpotifyApi.PlaylistObjectSimplified[]>(playlistsAtom);
  useEffect(() => {
    if (!spotifyClient) return;
    spotifyClient
      .getUserPlaylists()
      .then(data => setPlaylists(data.body.items));
  }, [spotifyClient]);

  return playlists;
};

export const usePlaylist = (playlistId: null | SpotifyApi.PlaylistObjectSimplified['id']) => {
  const spotifyClient = useSpotifyClient();
  const [playlist, setPlaylist] = useState<null | SpotifyApi.SinglePlaylistResponse>(null);
  useEffect(() => {
    async function fetchData() {
      if (!spotifyClient) return;
      if (!playlistId) return;
      const response1 = await spotifyClient.getPlaylist(playlistId);
      setPlaylist(response1.body);
    }
    fetchData();
  }, [spotifyClient, playlistId]);

  return { playlist };
};
