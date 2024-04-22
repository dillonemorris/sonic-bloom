"use client";

import { useState } from "react";
import { PaginationWithCreateLink } from "./PaginationWithCreateLink";
import { ItemsList } from "./ItemsList";
import { Item, useAccessToken } from "../Providers";
import { ItemsSkeleton } from "./ItemsSkeleton";
import useSWR from "swr";
import { ITEMS_PER_PAGE } from "./constants";
import { ActiveTypeTabs } from "./ActiveTypeTabs";

export type ActiveTypeState = "artists" | "tracks";

export const ItemsSelection = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [activeType, setActiveType] = useState<ActiveTypeState>("tracks");
  const { items, isLoading } = useItems(pageIndex, activeType);

  if (isLoading || !items.length) {
    return (
      <div className="mt-24">
        <ItemsSkeleton />
      </div>
    );
  }

  return (
    <>
      <ActiveTypeTabs activeType={activeType} onTabClick={setActiveType} />
      <ItemsList items={items} />
      <div className="mt-6">
        <PaginationWithCreateLink
          pageIndex={pageIndex}
          onNextClick={() => setPageIndex((index) => index + 1)}
          onPrevClick={() => setPageIndex((index) => index - 1)}
        />
      </div>
    </>
  );
};

type Items = {
  items: Item[];
  isLoading: boolean;
};

const useItems = (pageIndex: number, activeType: ActiveTypeState): Items => {
  const { data, isLoading } = useItemsResponse(pageIndex, activeType);
  return {
    isLoading,
    items: data?.items
      ? data.items.map((item: any) => {
          if (activeType === "artists") {
            return serializeArtist(item);
          }

          return serializeTrack(item);
        })
      : [],
  };
};

const serializeArtist = (artist: any): Item => {
  const { images } = artist;
  return {
    id: artist.id,
    name: artist.name,
    imageUrl: images[images.length - 1].url,
    type: "artist",
  };
};

const serializeTrack = (track: any): Item => {
  const { images } = track.album;
  return {
    id: track.id,
    name: track.name,
    artist: track.artists[0].name,
    imageUrl: images[images.length - 1].url,
    type: "song",
  };
};

const useItemsResponse = (pageIndex: number, activeType: ActiveTypeState) => {
  const fetcher = useFetchWithToken();
  const offset = pageIndex * ITEMS_PER_PAGE;
  const token = useAccessToken();
  const response = useSWR(
    [`me/top/${activeType}?offset=${offset}&limit=${ITEMS_PER_PAGE}`, token],
    ([url, token]) => fetcher(url, token)
  );

  return response;
};

const useFetchWithToken = () => {
  return async (params: string, token: string) => {
    const res = await fetch(`https://api.spotify.com/v1/${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return await res.json();
  };
};
