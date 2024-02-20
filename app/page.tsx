import { MusicalNoteIcon } from "@heroicons/react/24/outline";
import { TrackList } from "./TrackList";

export default async function Home() {
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
          <TrackList />
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

// const getRecommendations = async () => {
//   const tracks = await getTopTracks();

//   // TODO: pass a comma separated list of selected tracks
//   const data = await fetchWithToken(
//     `recommendations?seed_artists=${tracks[0].artists[0].id}`
//   );

//   return data ? data.tracks : [];
// };
