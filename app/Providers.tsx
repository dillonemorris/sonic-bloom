"use client";

import { SessionProvider } from "next-auth/react";
import { createContext, useState, useContext } from "react";

type SlideOverVisibilityContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
} | null;

const SlideOverVisibilityContext =
  createContext<SlideOverVisibilityContextType>(null);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [isSlideoverOpen, setIsSlideoverOpen] = useState(false);
  return (
    <SessionProvider>
      <SlideOverVisibilityContext.Provider
        value={{
          isOpen: isSlideoverOpen,
          open: () => setIsSlideoverOpen(true),
          close: () => setIsSlideoverOpen(false),
        }}
      >
        {children}
      </SlideOverVisibilityContext.Provider>
    </SessionProvider>
  );
}

export const useSlideoverVisibilty = () => {
  const context = useContext(SlideOverVisibilityContext);
  if (!context) {
    throw new Error(
      "useSlideoverVisibilty has to be used within <SlideOverVisibilityContext.Provider>"
    );
  }

  return context;
};
