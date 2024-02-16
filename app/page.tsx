import { auth } from "../auth";

export default async function Home() {
  const tracks = await getTracks();
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

const getTracks = async () => {
  const session = await auth();
  const res = await fetch("https://api.spotify.com/v1/me/top/tracks", {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tracks");
  }

  const tracks = await res.json();

  return tracks.items;
};

const getRecommendations = async () => {
  const session = await auth();
  const tracks = await getTracks();

  const res = await fetch(
    `https://api.spotify.com/v1/recommendations?seed_artists=${tracks[0].artists[0].id}`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch tracks");
  }

  const recommendations = await res.json();

  return recommendations;
};
