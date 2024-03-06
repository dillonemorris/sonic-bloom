"use client";

import { SessionProvider } from "next-auth/react";
import { createContext, useState, useContext } from "react";

type ProviderProps = { children: React.ReactNode };

export default function Providers({ children }: ProviderProps) {
  return (
    <SessionProvider>
      <SlideOverVisibilityProvider>
        <TracksProvider>{children}</TracksProvider>
      </SlideOverVisibilityProvider>
    </SessionProvider>
  );
}

// TODO: Delete if not used after changing UX
type SlideOverVisibilityContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
} | null;

const SlideOverVisibilityContext =
  createContext<SlideOverVisibilityContextType>(null);

const SlideOverVisibilityProvider = ({ children }: ProviderProps) => {
  const [isSlideoverOpen, setIsSlideoverOpen] = useState(false);
  return (
    <SlideOverVisibilityContext.Provider
      value={{
        isOpen: isSlideoverOpen,
        open: () => setIsSlideoverOpen(true),
        close: () => setIsSlideoverOpen(false),
      }}
    >
      {children}
    </SlideOverVisibilityContext.Provider>
  );
};

export const useSlideoverVisibilty = () => {
  const context = useContext(SlideOverVisibilityContext);
  if (!context) {
    throw new Error(
      "useSlideoverVisibilty has to be used within <SlideOverVisibilityContext.Provider>"
    );
  }

  return context;
};

type Track = {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
};

type TracksContextType = {
  list: Track[];
  onTrackClick: (track: Track) => void;
} | null;

const TracksContext = createContext<TracksContextType>(null);

const TracksProvider = ({ children }: ProviderProps) => {
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);

  const handleTrackClick = (track: Track) => {
    setSelectedTracks((tracks: Track[]) => {
      if (tracks.find(({ id }) => id === track.id)) {
        return tracks.filter(({ id }) => id !== track.id);
      }

      return [...tracks, track];
    });
  };

  return (
    <TracksContext.Provider
      value={{
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
