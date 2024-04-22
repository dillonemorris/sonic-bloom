import Image from "next/image";
import { Item, useSelectedItems } from "../Providers";
import { PlusIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/24/outline";
import { MAX_ITEMS } from "./constants";

type ItemsListProps = { items: Item[] };

export const ItemsList = ({ items }: ItemsListProps) => {
  const { onItemClick, isSelected, list } = useSelectedItems();

  return (
    <ul role="list" className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((item) => {
        const Icon = isSelected(item) ? CheckIcon : PlusIcon;
        return (
          <li key={item.id}>
            <button
              type="button"
              disabled={!isSelected(item) && list.length === MAX_ITEMS}
              onClick={() => onItemClick(item)}
              className={`group flex w-full items-center justify-between space-x-3 rounded-full border border-gray-300 p-2 text-left shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-offset-2 ${
                isSelected(item) &&
                "bg-neutral-950 hover:bg-neutral-950 border-gray-950"
              }`}
            >
              <span className="flex min-w-0 flex-1 items-center space-x-3">
                <span className="block flex-shrink-0">
                  <Image
                    className="h-10 w-10 rounded-full"
                    src={item.imageUrl}
                    width={64}
                    height={64}
                    alt={
                      item.type === "song"
                        ? "Track Album Image"
                        : "Artist Image"
                    }
                  />
                </span>
                <span className="block min-w-0 flex-1">
                  <span
                    className={`block truncate text-sm font-medium text-gray-900 ${
                      isSelected(item) && "text-white"
                    }`}
                  >
                    {item.name}
                  </span>
                  <div className="flex">
                    <span
                      className={`capitalize block truncate text-xs font-medium text-gray-500 ${
                        isSelected(item) && "text-slate-400"
                      }`}
                    >
                      {item.type}
                    </span>
                    {item.artist ? (
                      <span
                        className={`block truncate text-xs font-medium text-gray-500 ${
                          isSelected(item) && "text-slate-400"
                        }`}
                      >
                        <span className="mx-1 text-xs">&#8226;</span>
                        {item.artist}
                      </span>
                    ) : null}
                  </div>
                </span>
              </span>
              <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center">
                <Icon
                  className={`h-5 w-5 text-gray-400 group-hover:text-gray-500 ${
                    isSelected(item) &&
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
