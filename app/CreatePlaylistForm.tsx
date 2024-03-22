"use client";

import useSWR from "swr";
import Image from "next/image";
import useSWRMutation from "swr/mutation";
import useSWRImmutable from "swr/immutable";
import { useSession } from "next-auth/react";
import { useSelectedTracks } from "./Providers";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  MinusIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";

const MAX_SEEDS = 5;

export const CreatePlaylistForm = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [trackCount, setTrackCount] = useState("50");
  const { trigger, data: emptyPlaylist } = useCreatePlaylistMutation();
  const { isLoading, data: playlist } = useAddTracksQuery(
    emptyPlaylist?.id,
    trackCount
  );
  const { list } = useSelectedTracks();
  const doesListExceedMax = list.length > MAX_SEEDS;

  const tracks = useRecommendations(trackCount);

  console.log(tracks, trackCount);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // @ts-ignore
        const name = e.target.playlistName.value || "Hello from Sonic Bloom";
        trigger({ name });
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
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5 mb-2"
              >
                Playlist name
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                type="text"
                name="playlistName"
                id="name"
                className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="space-y-2 px-4 flex flex-col sm:space-y-0 sm:px-6 sm:py-5">
            <label
              htmlFor="trackCount"
              className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5 mb-2"
            >
              Number of tracks
            </label>
            <select
              id="trackCount"
              name="trackCount"
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={trackCount}
              onChange={(e) => setTrackCount(e.target.value)}
            >
              <option>20</option>
              <option>25</option>
              <option>30</option>
              <option>40</option>
              <option>50</option>
              <option>100</option>
            </select>
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

      <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
        <div className="flex justify-end space-x-3">
          {(() => {
            if (playlist?.snapshot_id) {
              return (
                <Success playlistUrl={emptyPlaylist.external_urls.spotify} />
              );
            }

            if (doesListExceedMax) {
              return <Error />;
            }

            return (
              <button
                type="submit"
                className="inline-flex justify-center rounded-md bg-teal-600 p-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 w-full"
              >
                {isLoading ? (
                  <ArrowPathIcon className="w-5 h-5 animate-spin mr-2" />
                ) : null}
                {isLoading ? "Loading..." : "Create"}
              </button>
            );
          })()}
        </div>
      </div>
    </form>
  );
};

const Success = ({ playlistUrl }: { playlistUrl: string }) => {
  return (
    <div className="rounded-md bg-green-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon
            className="h-5 w-5 text-green-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">
            Successfully created
          </h3>
          <div className="mt-2 text-sm text-green-700">
            <p>
              Your playlist has been created and is now available in Spotify!
            </p>
          </div>
          <div className="mt-4">
            <div className="-mx-2 -my-1.5 flex">
              <Link
                href={playlistUrl}
                className="rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
              >
                View playlist
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Error = () => {
  return (
    <div className="rounded-md bg-red-50 p-4 w-full">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            You have too many seeds, the limit is 5
          </h3>
        </div>
      </div>
    </div>
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

const useAddTracksQuery = (playlistId: string | null, trackCount: string) => {
  const fetcher = useFetchWithToken();
  const token = useAccessToken();
  const tracks = useRecommendations(trackCount);
  const trackUris = tracks?.map((track: any) => track.uri).join(",");

  return useSWRImmutable(
    playlistId
      ? [`playlists/${playlistId}/tracks?uris=${trackUris}`, token]
      : null,
    ([url, token]) => fetcher(url, token, "POST")
  );
};

// Creates an empty playlist in which tracks can then be added
// Spotify API does not accept tracks as a parameter to playlist creation
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

const useRecommendations = (count: string) => {
  const fetcher = useFetchWithToken();
  const token = useAccessToken();
  const { list: seedTracks } = useSelectedTracks();
  const seedTrackIds = seedTracks.map((track) => track.id);

  const { data } = useSWR(
    [
      `recommendations?seed_tracks=${seedTrackIds.join()}&limit=${count}`,
      token,
    ],
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
