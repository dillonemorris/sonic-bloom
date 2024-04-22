import Image from "next/image";
import { Item as ItemType, useSelectedItems } from "./Providers";
import { ReactElement, createContext, useContext } from "react";
import classNames from "classnames";

export interface ItemProps extends React.ComponentPropsWithoutRef<"button"> {
  item: ItemType;
  icon: ReactElement;
}
const Item = ({ item, children, className, icon, ...rest }: ItemProps) => {
  const { onItemClick } = useSelectedItems();
  return (
    <ItemContext.Provider value={{ item }}>
      <li key={item.id}>
        <button
          type="button"
          onClick={() => onItemClick(item)}
          className={classNames(
            "group flex w-full items-center justify-between space-x-3 rounded-full border border-gray-300 p-2 text-left shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-offset-2",
            className
          )}
          {...rest}
        >
          <span className="flex min-w-0 flex-1 items-center space-x-3">
            <span className="block flex-shrink-0">
              <Image
                className="h-10 w-10 rounded-full"
                src={item.imageUrl}
                width={64}
                height={64}
                alt={
                  item.type === "song" ? "Track Album Image" : "Artist Image"
                }
              />
            </span>
            <span className="block min-w-0 flex-1">{children}</span>
          </span>
          <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center">
            {icon}
          </span>
        </button>
      </li>
    </ItemContext.Provider>
  );
};

const Name = ({ className }: React.ComponentPropsWithoutRef<"span">) => {
  const { item } = useItem();
  return (
    <span
      className={classNames(
        "block truncate text-sm font-medium text-gray-900",
        className
      )}
    >
      {item.name}
    </span>
  );
};

const Details = ({ className }: React.ComponentPropsWithoutRef<"span">) => {
  const { item } = useItem();
  return (
    <div className="flex">
      <span
        className={classNames(
          "capitalize block truncate text-xs font-medium text-gray-500",
          className
        )}
      >
        {item.type}
      </span>
      {item.artist ? (
        <span
          className={classNames(
            "block truncate text-xs font-medium text-gray-500",
            className
          )}
        >
          <span className="mx-1 text-xs">&#8226;</span>
          {item.artist}
        </span>
      ) : null}
    </div>
  );
};

type ItemContextType = {
  item: ItemType;
} | null;

const ItemContext = createContext<ItemContextType>(null);

export const useItem = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error("useItem has to be used within <ItemContext.Provider>");
  }

  return context;
};

Item.Name = Name;
Item.Details = Details;

export default Item;
