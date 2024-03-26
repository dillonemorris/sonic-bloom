import useSWR from "swr";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useSelectedTracks } from "../Providers";
import { PlusIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/24/outline";
import { TrackListSkeleton } from "./TrackListSkeleton";
import { MAX_SEEDS, TRACKS_PER_PAGE } from "./constants";

export const TrackList = ({ pageIndex }: { pageIndex: number }) => {
  const { isLoading, tracks } = useSerializedTopTracks(pageIndex);
  const { onTrackClick, isSelected, list } = useSelectedTracks();

  if (isLoading || !tracks.length) {
    return <TrackListSkeleton />;
  }

  return (
    <ul role="list" className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      {tracks.map((track) => {
        const Icon = isSelected(track) ? CheckIcon : PlusIcon;
        return (
          <li key={track.id}>
            <button
              type="button"
              disabled={!isSelected(track) && list.length === MAX_SEEDS}
              onClick={() => onTrackClick(track)}
              className={`group flex w-full items-center justify-between space-x-3 rounded-full border border-gray-300 p-2 text-left shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-offset-2 ${
                isSelected(track) &&
                "bg-neutral-950 hover:bg-neutral-950 border-gray-950"
              }`}
            >
              <span className="flex min-w-0 flex-1 items-center space-x-3">
                <span className="block flex-shrink-0">
                  <Image
                    className="h-10 w-10 rounded-full"
                    src={track.imageUrl}
                    width={64}
                    height={64}
                    alt="Track Album Image"
                  />
                </span>
                <span className="block min-w-0 flex-1">
                  <span
                    className={`block truncate text-sm font-medium text-gray-900 ${
                      isSelected(track) && "text-white"
                    }`}
                  >
                    {track.name}
                  </span>
                  <span
                    className={`block truncate text-sm font-medium text-gray-500 ${
                      isSelected(track) && "text-slate-400"
                    }`}
                  >
                    {track.artist}
                  </span>
                </span>
              </span>
              <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center">
                <Icon
                  className={`h-5 w-5 text-gray-400 group-hover:text-gray-500 ${
                    isSelected(track) &&
                    "text-white group-hover:text-white stroke-2"
                  }`}
                  aria-hidden="true"
                />
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

type Track = {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
};

type Tracks = {
  tracks: Track[];
  isLoading: boolean;
};

const useSerializedTopTracks = (pageIndex: number): Tracks => {
  const { data, isLoading } = useTopTracks(pageIndex);
  return {
    isLoading,
    tracks: data?.items
      ? data.items.map((track: any) => {
          const { images } = track.album;
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            imageUrl: images[images.length - 1].url,
          };
        })
      : [],
  };
};

const useTopTracks = (pageIndex: number) => {
  const fetcher = useFetchWithToken();
  const offset = pageIndex * TRACKS_PER_PAGE;
  const token = useAccessToken();
  const response = useSWR(
    [`me/top/tracks?offset=${offset}&limit=${TRACKS_PER_PAGE}`, token],
    ([url, token]) => fetcher(url, token)
  );

  return response;
};

const useAccessToken = (): string => {
  const { data: session } = useSession();
  //@ts-ignore
  return session?.user.accessToken;
};

const useFetchWithToken = () => {
  return async (params: string, token: string) => {
    const res = await fetch(`https://api.spotify.com/v1/${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return await res.json();
  };
};
