import { MySession } from "@/types";
import { auth } from "../auth";

export default async function Home() {
  const tracks = await getTopTracks();
  const recommendations = await getRecommendations();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        {tracks.map((track) => {
          return (
            <div className="py-4" key={track.id}>
              <h3 className="font-bold">{track.name}</h3>
              <p>{track.artists[0].name}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}

const getRecommendations = async () => {
  const tracks = await getTopTracks();

  // TODO: pass a comma separated list of selected tracks
  const data = await fetchWithToken(
    `recommendations?seed_artists=${tracks[0].artists[0].id}`
  );

  return data ? data.tracks : [];
};

const getTopTracks = async () => {
  // TODO: Should fetch new set of tracks on request
  const data = await fetchWithToken("me/top/tracks");
  return data ? data.items : [];
};

const fetchWithToken = async (params: string) => {
  const session = await auth();
  const res = await fetch(`https://api.spotify.com/v1/${params}`, {
    headers: {
      //@ts-ignore
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch");
  }

  return await res.json();
};
