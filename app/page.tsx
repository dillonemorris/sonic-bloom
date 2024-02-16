import { PlusIcon } from "@heroicons/react/16/solid";
import { auth } from "../auth";
import Image from "next/image";
import { MusicalNoteIcon } from "@heroicons/react/24/outline";

type Track = {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
};

export default async function Home() {
  const tracks = await getTopTracks();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="mx-auto max-w-md sm:max-w-2xl">
        <div className="text-center">
          <MusicalNoteIcon className="mx-auto h-8 w-8 text-gray-400" />
          <h2 className="text-lg mt-1 font-semibold leading-6 text-gray-900">
            SonicBloom
          </h2>
          <p className="mt-2 text-sm text-gray-500 text-center">
            Ready to grow your sound garden? Select up to 5 tracks to serve as
            seeds for your personalized playlist.
          </p>
        </div>
        <div className="mt-8">
          <ul
            role="list"
            className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {tracks.map((track) => (
              <li key={track.id}>
                <button
                  type="button"
                  className="group flex w-full items-center justify-between space-x-3 rounded-full border border-gray-300 p-2 text-left shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="flex min-w-0 flex-1 items-center space-x-3">
                    <span className="block flex-shrink-0">
                      <Image
                        className="h-10 w-10 rounded-full"
                        src={track.imageUrl}
                        width={64}
                        height={64}
                        alt=""
                      />
                    </span>
                    <span className="block min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-gray-900">
                        {track.name}
                      </span>
                      <span className="block truncate text-sm font-medium text-gray-500">
                        {track.artist}
                      </span>
                    </span>
                  </span>
                  <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center">
                    <PlusIcon
                      className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <form className="mt-10 sm:flex sm:items-center" action="#">
            <label htmlFor="playlist" className="sr-only">
              create playlist
            </label>
            <div className="grid grid-cols-1 sm:flex-auto">
              <input
                type="text"
                name="playlist"
                id="playlist"
                className="peer relative col-start-1 row-start-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 px-4"
                placeholder="Enter a name for your playlist"
              />
              <div
                className="col-start-1 col-end-3 row-start-1 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-600"
                aria-hidden="true"
              />
            </div>
            <div className="mt-3 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
              <button
                type="submit"
                className="block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Create playlist
              </button>
            </div>
          </form>
        </div>
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

const getTopTracks = async (): Promise<Track[]> => {
  // TODO: Offset should be (prev offset + (12 - selectedTracks.length))
  const data = await fetchWithToken("me/top/tracks?offset=12&limit=12");
  return data
    ? data.items.map((track: any) => {
        const { images } = track.album;
        return {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          imageUrl: images[images.length - 1].url,
        };
      })
    : [];
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
