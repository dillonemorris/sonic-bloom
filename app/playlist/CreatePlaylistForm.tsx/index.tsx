"use client";

import useSWR from "swr";
import { useState } from "react";
import useSWRMutation from "swr/mutation";
import useSWRImmutable from "swr/immutable";
import { SubmitButton } from "./SubmitButton";
import { SuccessMessage } from "./SuccessMessage";
import { useAccessToken, useSelectedItems } from "../../Providers";
import { TrackCountSelect } from "./TrackCountSelect";
import { SelectedItemsList } from "./SelectedItemsList";

/**
 * TODO:
 * Allow for adding tracks and/or artists to recommendations
 */

export const CreatePlaylistForm = () => {
  const [trackCount, setTrackCount] = useState("25");
  const { trigger, data: playlist } = useCreatePlaylistMutation();
  const { isLoading, data: playlistWithTracks } = useAddTracksQuery(
    playlist?.id,
    trackCount
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // @ts-ignore
        const name = e.target.playlistName.value || "Hello from Sonic Bloom";
        trigger({ name });
      }}
      className="flex h-full flex-col"
    >
      <div className="flex-1">
        {/* Header */}
        <div className="p-4 text-center">
          <div className="flex items-start justify-between space-x-3">
            <div className="space-y-1">
              <h2 className="text-base font-semibold leading-6 text-gray-900">
                New playlist
              </h2>
              <p className="text-sm text-gray-500">
                These are the seeds for your personalized playlist.
              </p>
            </div>
          </div>
        </div>
        {/* Divider container */}
        <div className="py-6 sm:divide-y sm:divide-gray-200">
          {/* Playlist name */}
          <div className="flex flex-col py-5">
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

          <div className="flex flex-col py-5">
            <TrackCountSelect
              trackCount={trackCount}
              setTrackCount={setTrackCount}
            />
          </div>

          {/* Tracks */}
          <fieldset className="space-y-4 flex flex-col">
            <legend className="sr-only">Seeds</legend>
            <div
              className="text-sm font-medium leading-6 text-gray-900"
              aria-hidden="true"
            >
              Seeds
            </div>
            <SelectedItemsList />
          </fieldset>
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-gray-200 py-5 mt-4">
        <div className="flex justify-end space-x-3">
          {!!playlistWithTracks?.snapshot_id ? (
            <SuccessMessage playlistUrl={playlist.external_urls.spotify} />
          ) : (
            <SubmitButton isLoading={isLoading} />
          )}
        </div>
      </div>
    </form>
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
// Spotify API does not accept tracks as a parameter during playlist creation
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
  const seedsParams = useSeedParams();

  const { data } = useSWRImmutable(
    [`recommendations?${seedsParams}&limit=${count}`, token],
    ([url, token]) => fetcher(url, token)
  );

  return data?.tracks;
};

const useSeedParams = () => {
  const params = new URLSearchParams();
  const { list } = useSelectedItems();
  const artists = list.filter((item) => item.type === "artist");
  const tracks = list.filter((item) => item.type === "song");

  if (artists.length) {
    params.append("seed_artists", artists.map((a) => a.id).join());
  }

  if (tracks.length) {
    params.append("seed_tracks", tracks.map((t) => t.id).join());
  }

  return params.toString();
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
