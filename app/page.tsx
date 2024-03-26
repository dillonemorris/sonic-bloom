import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { MusicalNoteIcon } from "@heroicons/react/24/outline";
import { TrackSelection } from "./TrackSelection";

export default async function Home() {
  const isSignedIn = await isAuthenticated();
  if (!isSignedIn) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 py-16 px-4">
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
          <TrackSelection />
        </div>
      </div>
    </main>
  );
}

const isAuthenticated = async () => {
  const session = await auth();
  //@ts-ignore
  const expiresAt = session?.user?.expiresAt;
  const isTokenActive = expiresAt * 1000 >= Math.floor(Date.now());
  return !!session && isTokenActive;
};
