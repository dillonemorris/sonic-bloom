import { MusicalNoteIcon } from "@heroicons/react/24/outline";
import { TrackList } from "./TrackList";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SlideOver } from "./SlideOver";
import { CreatePlaylistForm } from "./CreatePlaylistForm";

export default async function Home() {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }

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
      </div>
      <SlideOver>
        <CreatePlaylistForm />
      </SlideOver>
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
