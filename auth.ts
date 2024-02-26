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
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-top-read playlist-modify-private",
    }),
  ],
  secret: process.env.SPOTIFY_CLIENT_SECRET,
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.id = user.id;
        token.expiresAt = account.expires_at;
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      //@ts-ignore
      session.user = token;
      return session;
    },
  },
});
