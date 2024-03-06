"use client";

import useSWR from "swr";
import Image from "next/image";
import useSWRMutation from "swr/mutation";
import useSWRImmutable from "swr/immutable";
import { useSession } from "next-auth/react";
import { useSelectedTracks } from "./Providers";
import { MinusIcon } from "@heroicons/react/24/outline";

// TODO:
// 1. Allow user to determine playlist size
// 2. Pass unique name for playlist
// 3. Show success message

export const CreatePlaylistForm = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { trigger, data: emptyPlaylist } = useCreatePlaylistMutation();
  const playlist = useAddTracksQuery(emptyPlaylist?.id);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        trigger({ name: "Hello from Sonic Bloom" });
      }}
      className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl"
    >
      <div className="flex-1">
        {/* Header */}
        <div className="bg-gray-50 px-4 py-6 sm:px-6">
          <div className="flex items-start justify-between space-x-3">
            <div className="space-y-1">
              <h2 className="text-base font-semibold leading-6 text-gray-900">
                New playlist
              </h2>
              <p className="text-sm text-gray-500">
                These are the seeds for your personalized playlist.
              </p>
            </div>
            {children}
          </div>
        </div>

        {/* Divider container */}
        <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
          {/* Playlist name */}
          <div className="space-y-2 px-4 flex flex-col sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="playlist-name"
                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5 mb-2"
              >
                Playlist name
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                type="text"
                name="playlist-name"
                id="playlist-name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Tracks */}
          <fieldset className="space-y-2 px-4 flex flex-col">
            <legend className="sr-only">Tracks</legend>
            <div
              className="text-sm font-medium leading-6 text-gray-900"
              aria-hidden="true"
            >
              Tracks
            </div>
            <TrackList />
          </fieldset>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={close}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            Create
          </button>
        </div>
      </div>
    </form>
  );
};

const TrackList = () => {
  const { list, onTrackClick } = useSelectedTracks();
  return (
    <ul role="list" className="mt-6 flex flex-col gap-2">
      {list.map((track) => (
        <li key={track.id}>
          <button
            onClick={() => onTrackClick(track)}
            type="button"
            className="group flex w-full items-center justify-between space-x-3 rounded-full border border-gray-300 p-2 text-left shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
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
              <MinusIcon
                className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
};

const useAddTracksQuery = (playlistId: string | null) => {
  const fetcher = useFetchWithToken();
  const token = useAccessToken();
  const tracks = useRecommendations();
  const trackUris = tracks?.map((track: any) => track.uri).join(",");
  const { data } = useSWRImmutable(
    playlistId
      ? [`playlists/${playlistId}/tracks?uris=${trackUris}`, token]
      : null,
    ([url, token]) => fetcher(url, token, "POST")
  );

  return data;
};

const useCreatePlaylistMutation = () => {
  const createPlaylist = useCreatePlaylist();
  const userId = useUserId();
  const token = useAccessToken();

  return useSWRMutation(
    [`users/${userId}/playlists`, token],
    ([url, token], { arg }: { arg: { name: string } }) =>
      createPlaylist(url, token, arg.name)
  );
};

const useCreatePlaylist = () => {
  return async (url: string, token: string, name: string) => {
    const res = await fetch(`https://api.spotify.com/v1/${url}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    return await res.json();
  };
};

const useUserId = () => {
  const fetcher = useFetchWithToken();
  const token = useAccessToken();
  const { data: user } = useSWR(["me", token], ([url, token]) =>
    fetcher(url, token)
  );
  return user?.id;
};

const useRecommendations = () => {
  const fetcher = useFetchWithToken();
  const token = useAccessToken();
  const { list: seedTracks } = useSelectedTracks();
  const seedTrackIds = seedTracks.map((track) => track.id);

  const { data } = useSWR(
    [`recommendations?seed_tracks=${seedTrackIds.join()}`, token],
    ([url, token]) => fetcher(url, token)
  );

  return data?.tracks;
};

const useAccessToken = (): string => {
  const { data: session } = useSession();
  //@ts-ignore
  return session?.user.accessToken;
};

const useFetchWithToken = () => {
  return async (url: string, token: string, method = "GET") => {
    const res = await fetch(`https://api.spotify.com/v1/${url}`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
    });

    return await res.json();
  };
};
