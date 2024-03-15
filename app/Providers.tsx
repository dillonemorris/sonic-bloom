"use client";

import { SessionProvider } from "next-auth/react";
import { createContext, useState, useContext } from "react";

type ProviderProps = { children: React.ReactNode };

export default function Providers({ children }: ProviderProps) {
  return (
    <SessionProvider>
      <SelectedTracksProvider>{children}</SelectedTracksProvider>
    </SessionProvider>
  );
}

type Track = {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
};

type TracksContextType = {
  list: Track[];
  isSelected: (track: Track) => boolean;
  onTrackClick: (track: Track) => void;
} | null;

const TracksContext = createContext<TracksContextType>(null);

const SelectedTracksProvider = ({ children }: ProviderProps) => {
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
  const isSelected = (track: Track): boolean => {
    return selectedTracks.some(({ id }) => id === track.id);
  };

  const handleTrackClick = (track: Track) => {
    setSelectedTracks((tracks: Track[]) => {
      if (isSelected(track)) {
        return tracks.filter(({ id }) => id !== track.id);
      }

      return [...tracks, track];
    });
  };

  return (
    <TracksContext.Provider
      value={{
        isSelected,
        list: selectedTracks,
        onTrackClick: handleTrackClick,
      }}
    >
      {children}
    </TracksContext.Provider>
  );
};

export const useSelectedTracks = () => {
  const context = useContext(TracksContext);
  if (!context) {
    throw new Error(
      "useSelectedTracks has to be used within <TracksContext.Provider>"
    );
  }

  return context;
};
