import SpotifyWebApi from "spotify-web-api-node";

/**
The access to the protected resources is determined by one or several scopes. 
Scopes enable your application to access specific functionality 
(e.g. read a playlist, modify your library or just streaming) on behalf of a user. 
The set of scopes you set during the authorization, determines the access permissions 
that the user is asked to grant.
You can find detailed information about scopes in the [scopes documentation](https://developer.spotify.com/documentation/web-api/concepts/scopes).
*/
const scopes = [
  // Images
  // "ugc-image-upload",
  // Spotify Connect
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  // Playback
  // "app-remote-control",
  "streaming",
  // Playlists
  "playlist-read-private",
  "playlist-read-collaborative",
  // "playlist-modify-private",
  // "playlist-modify-public",
  // Follow
  // "user-follow-modify",
  "user-follow-read",
  // Listening History
  // "user-read-playback-position",
  "user-top-read",
  "user-read-recently-played",
  // Library
  "user-library-modify",
  "user-library-read",
  // Users
  "user-read-email",
  "user-read-private",
];
const queryParamsString = new URLSearchParams({ scope: scopes.join(',') }).toString();
export const SPOTIFY_LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamsString}`;

export const spotifyClient = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});