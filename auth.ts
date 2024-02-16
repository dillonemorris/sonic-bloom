import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      // may need to add scpoe for playlist creation and/or recommendations
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-top-read",
    }),
  ],
  secret: process.env.SPOTIFY_CLIENT_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
