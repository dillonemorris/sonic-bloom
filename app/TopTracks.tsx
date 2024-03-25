"use client";

import useSWR from "swr";
import Image from "next/image";
import { useState } from "react";
import { useSelectedTracks } from "./Providers";
import { useSession } from "next-auth/react";
import { PlusIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const MAX_SEEDS = 5;

export const TopTracks = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const { isLoading, tracks } = useSerializedTopTracks(pageIndex);

  return (
    <>
      {isLoading || !tracks.length ? (
        <SkeletonTrackList />
      ) : (
        <TrackList pageIndex={pageIndex} />
      )}
      <div className="mt-6">
        <Pagination
          pageIndex={pageIndex}
          onNextClick={() => setPageIndex((index) => index + 1)}
          onPrevClick={() => setPageIndex((index) => index - 1)}
        />
      </div>
    </>
  );
};

type PaginationProps = {
  pageIndex: number;
  onNextClick: () => void;
  onPrevClick: () => void;
};

const Pagination = ({
  pageIndex,
  onNextClick,
  onPrevClick,
}: PaginationProps) => {
  const { list } = useSelectedTracks();
  const hasSelectedTracks = list.length > 0;

  return (
    <nav
      className="flex items-center justify-between border-t border-gray-200 bg-white py-3"
      aria-label="Pagination"
    >
      <div className="hidden sm:block font-semibold">
        <p className="text-sm text-gray-700">
          {list.length} of {MAX_SEEDS} tracks selected
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        <button
          disabled={pageIndex === 0}
          onClick={onPrevClick}
          className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus-visible:outline-offset-0 ${
            pageIndex === 0
              ? "bg-gray-100 hover:bg-gray-100"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          Previous
        </button>
        <button
          onClick={onNextClick}
          className="ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
        >
          Next
        </button>
        <Link
          href="/playlist"
          className={`ml-3 top-6 right-6 inline-flex items-center gap-x-1.5 rounded-md px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${
            hasSelectedTracks
              ? "bg-neutral-950 text-white hover:bg-neutral-800 ring-0"
              : null
          }`}
        >
          Create Playlist
        </Link>
      </div>
    </nav>
  );
};

const TrackList = ({ pageIndex }: { pageIndex: number }) => {
  const { tracks } = useSerializedTopTracks(pageIndex);
  const { onTrackClick, isSelected, list } = useSelectedTracks();

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

const TRACKS_PER_PAGE = 16;

const SkeletonTrackList = () => {
  return (
    <ul role="list" className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      {Array.from(Array(TRACKS_PER_PAGE)).map((_, i) => {
        return (
          <li key={i}>
            <div className="group flex w-full items-center justify-between space-x-3 rounded-full border border-gray-300 p-2 text-left shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
              <span className="flex min-w-0 flex-1 items-center space-x-3">
                <span className="block flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                </span>
                <span className="block min-w-0 flex-1">
                  <span className="block rounded-full bg-gray-100 h-2"></span>
                </span>
              </span>
              <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center">
                <PlusIcon
                  className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
              </span>
            </div>
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
