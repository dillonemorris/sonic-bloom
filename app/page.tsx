import { auth } from "@/auth";
import { TopTracks } from "./TopTracks";
import { SlideOver } from "./SlideOver";
import { redirect } from "next/navigation";
import { MusicalNoteIcon } from "@heroicons/react/24/outline";

export default async function Home() {
  await maybeRedirectToSignIn();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="mx-auto max-w-md sm:max-w-2xl">
        <Header />
        <div className="mt-8">
          <TopTracks />
          Header
        </div>
      </div>
      <SlideOver />
    </main>
  );
}

const maybeRedirectToSignIn = async () => {
  const isSignedIn = await isAuthenticated();
  if (!isSignedIn) {
    redirect("/api/auth/signin");
  }
};

const Header = () => {
  return (
    <div className="text-center">
      <MusicalNoteIcon className="mx-auto h-8 w-8 text-gray-400" />
      <h2 className="text-lg mt-1 font-semibold leading-6 text-gray-900">
        SonicBloom
      </h2>
      <p className="mt-2 text-sm text-gray-500 text-center">
        Ready to grow your sound garden? Select up to 5 tracks to serve as seeds
        for your personalized playlist.
      </p>
    </div>
  );
};

const isAuthenticated = async () => {
  const session = await auth();
  //@ts-ignore
  const expiresAt = session?.user?.expiresAt;
  const isTokenActive = expiresAt * 1000 >= Math.floor(Date.now());
  return !!session && isTokenActive;
};
