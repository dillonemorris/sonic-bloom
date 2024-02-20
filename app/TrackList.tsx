"use client";

import { auth } from "@/auth";
import { PlusIcon } from "@heroicons/react/16/solid";
import { useSession } from "next-auth/react";
import Image from "next/image";
import useSWR from "swr";

type Track = {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
};

export const TrackList = () => {
  const tracks = useTopTracks();

  return (
    <ul role="list" className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
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
  );
};

const useTopTracks = (): Track[] => {
  const fetchWithToken = useFetchWithToken();
  // TODO: Offset should be (prev offset + (12 - selectedTracks.length))
  const { data, error } = useSWR(
    "me/top/tracks?offset=12&limit=12",
    fetchWithToken
  );
  console.log(data, error);
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

const useFetchWithToken = () => {
  const { data: session } = useSession();

  return async (params: string) => {
    const res = await fetch(`https://api.spotify.com/v1/${params}`, {
      headers: {
        //@ts-ignore
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    return await res.json();
  };
};
