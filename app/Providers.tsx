"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { createContext, useState, useContext } from "react";

type ProviderProps = { children: React.ReactNode };

export default function Providers({ children }: ProviderProps) {
  return (
    <SessionProvider>
      <SelectItemsProvider>{children}</SelectItemsProvider>
    </SessionProvider>
  );
}

export type Item = {
  id: string;
  name: string;
  artist?: string;
  imageUrl: string;
  type: "song" | "artist";
};

type SelectItemsContextType = {
  list: Item[];
  isSelected: (item: Item) => boolean;
  onItemClick: (item: Item) => void;
} | null;

const SelectItemsContext = createContext<SelectItemsContextType>(null);

const SelectItemsProvider = ({ children }: ProviderProps) => {
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const isSelected = (item: Item): boolean => {
    return selectedItems.some(({ id }) => id === item.id);
  };

  const handleItemClick = (item: Item) => {
    setSelectedItems((items: Item[]) => {
      if (isSelected(item)) {
        return items.filter(({ id }) => id !== item.id);
      }

      return [...items, item];
    });
  };

  return (
    <SelectItemsContext.Provider
      value={{
        isSelected,
        list: selectedItems,
        onItemClick: handleItemClick,
      }}
    >
      {children}
    </SelectItemsContext.Provider>
  );
};

export const useSelectedItems = () => {
  const context = useContext(SelectItemsContext);
  if (!context) {
    throw new Error(
      "useSelectedItems has to be used within <SelectedItemsContext.Provider>"
    );
  }

  return context;
};

export const useAccessToken = (): string => {
  const { data: session } = useSession();
  //@ts-ignore
  return session?.user.accessToken;
};
