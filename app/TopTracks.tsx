"use client";

import useSWR from "swr";
import Image from "next/image";
import useSound from "use-sound";
import { useEffect, useState } from "react";
import { useSelectedTracks } from "./Providers";
import { useSession } from "next-auth/react";
import { PlusIcon } from "@heroicons/react/16/solid";
import { MinusIcon } from "@heroicons/react/24/outline";

export const TopTracks = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const { isLoading } = useSerializedTopTracks(pageIndex);

  return (
    <>
      {isLoading ? <SkeletonTrackList /> : <TrackList pageIndex={pageIndex} />}
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
  const { totalNum } = useSerializedTopTracks(pageIndex);

  return (
    <nav
      className="flex items-center justify-between border-t border-gray-200 bg-white py-3"
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{pageIndex * 16 + 1}</span> to{" "}
          <span className="font-medium">{(pageIndex + 1) * 16}</span> of{" "}
          <span className="font-medium w-4">{totalNum}</span> results
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        <button
          disabled={pageIndex === 0}
          onClick={onPrevClick}
          className={`relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus-visible:outline-offset-0 ${
            pageIndex === 0
              ? "bg-gray-100 hover:bg-gray-100"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          Previous
        </button>
        <button
          onClick={onNextClick}
          className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
        >
          Next
        </button>
      </div>
    </nav>
  );
};

const TrackList = ({ pageIndex }: { pageIndex: number }) => {
  const { list } = useSerializedTopTracks(pageIndex);
  const [currentTrack, setCurrentTrack] = useState<HTMLAudioElement | null>(
    null
  );
  const [isPaused, setIsPaused] = useState(true);

  // const handlePlay = (url: string) => {
  //   if (currentAudio?.getAttribute("src") === url) {
  //     if (isPaused) {
  //       currentAudio.play();
  //       setIsPaused(false);
  //     } else {
  //       currentAudio.pause();
  //       setIsPaused(true);
  //     }
  //   } else {
  //     const newAudio = new Audio(url);
  //     setCurrentAudio(newAudio);
  //     newAudio.play();
  //   }
  // };

  const handlePlayback = (url: string) => {
    const isNextTrack = currentTrack?.getAttribute("src") !== url;
    const newAudio = new Audio(url);

    if (currentTrack) {
      if (isPaused) {
        currentTrack.play();
        setIsPaused(false);
      } else {
        currentTrack.pause();
        setIsPaused(true);
      }
    }

    if (isNextTrack) {
      setCurrentTrack(newAudio);
      newAudio?.play();
      setIsPaused(false);
    }

    // if (isPaused) {
    //   currentAudio.play();
    // } else {
    //   currentAudio.pause();
    // }
  };

  // TODO:
  // There should only be 1 player even though each item has a control
  // The control must start a new audio track with whatever
  // track has been licked on

  return (
    <ul role="list" className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      {list.map((track) => {
        return (
          <TrackItem key={track.id} track={track} onPlayback={handlePlayback} />
        );
      })}
    </ul>
  );
};

type TrackItemProps = {
  track: Track;
  onPlayback: (previewUrl: string) => void;
};

const TrackItem = ({ track, onPlayback }: TrackItemProps) => {
  const { isSelected, onTrackClick } = useSelectedTracks();
  const Icon = isSelected(track) ? MinusIcon : PlusIcon;

  return (
    <li key={track.id}>
      <button
        type="button"
        onClick={() => {
          onTrackClick(track);
        }}
        className={`group flex w-full items-center justify-between space-x-3 rounded-full border border-gray-300 p-2 text-left shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-offset-2 ${
          isSelected(track) && "border-teal-500 bg-gray-50"
        }`}
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
        <button onClick={() => onPlayback(track.previewUrl)}>Play</button>
        <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center">
          <Icon
            className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />
        </span>
      </button>
    </li>
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
  previewUrl: string;
};

type Tracks = {
  list: Track[];
  totalNum: number;
  isLoading: boolean;
};

const useSerializedTopTracks = (pageIndex: number): Tracks => {
  const { data, isLoading } = useTopTracks(pageIndex);

  return {
    isLoading,
    totalNum: data?.total,
    list: data?.items
      ? data.items.map((track: any) => {
          const albumImages = track.album.images;
          const image = albumImages[albumImages.length - 1];
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            previewUrl: track.preview_url,
            imageUrl: image.url,
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
