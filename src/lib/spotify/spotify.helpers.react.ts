import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import SpotifyWebApi from "spotify-web-api-node";

const _spotifyClient = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export const useSpotifyClient = () => {
  const session = useSession();
  const [spotifyClient, setSpotifyClient] = useState<null | SpotifyWebApi>(null);

  // Redirect to login page when refreshAccess Token fails
  useEffect(() => {
    if (!session.data) return;
    if (session.data.error === 'RefreshAccessTokenError') signIn();
  }, [session.data]);

  // add access token to spotify client
  useEffect(() => {
    if (session.status !== 'authenticated') return;
    _spotifyClient.setAccessToken(session.data.user.accessToken);
    setSpotifyClient(_spotifyClient);
  }, [session.status, session.data]);

  return spotifyClient;
};
