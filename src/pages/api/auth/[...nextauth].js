import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { SPOTIFY_LOGIN_URL, spotifyClient } from "@/lib/spotify/spotify.helpers";

const refreshAccessTokenFromSpotify = async (token) => {
  try {
    console.log('TRYING TO REFRESH ACCESS TOKEN...');
    spotifyClient.setAccessToken(token.accessToken);
    spotifyClient.setRefreshToken(token.refreshToken);
    const { body } = await spotifyClient.refreshAccessToken();
    console.log('SUCCESS, NEW ACCES TOKEN: ', body.access_token);
    return {
      ...token,
      accessToken: body.access_token,
      accessTokenExpiresAt: Date.now() + (body.expires_in * 1000),// 1 hour from now
      refreshToken: body.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error(error);
    console.log('UNABLE TO REFRESH ACCESS TOKEN');
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: SPOTIFY_LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  //
  // defnie custom auth pages that will be rendered
  pages: {
    signIn: '/login'
  },
  // run custom code inside auth flow
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // console.log({ account, profile });

      // on first sign in ...
      if (account && user) {
        console.log('ACCESS TOKEN CRETED FOR FIRST TIME');
        // inject "access token" related data to the "next auth token" that will be passed to session
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.username = account.providerAccountId;
        token.accessTokenExpiresAt = account.expires_at * 1000;
        token.spotifyProfile = profile;
        return token;
      }

      // if access token already exists and it's still valid ...
      if (Date.now() < token.accessTokenExpiresAt) {
        console.log('ACCESS TOKEN EXISTS AND STILL VALID');
        return token;
      }

      // if accesss token is expired try to refresh it
      console.log('ACCESS TOKEN EXISTS BUT EXPIRED. TRYIBG REFRESHING IT');
      return await refreshAccessTokenFromSpotify(token);
    },
    async session({ session, token }) {
      // grap data from "token" returned from "jwt" callback and
      // inject "access token" related data to session.
      // session will be available to the frontend (via useSession())
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;
      session.user.spotifyProfile = token.spotifyProfile;
      return session;
    }
  }
});