import { CreatePlaylistForm } from "../CreatePlaylistForm";

export default function Playlist() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 py-16 px-4">
      <CreatePlaylistForm />
    </main>
  );
}
