import Image from "next/image";
import { useSelectedItems } from "@/app/Providers";
import { MinusIcon } from "@heroicons/react/24/outline";

export const SelectedItemsList = () => {
  const { list, onItemClick } = useSelectedItems();
  return (
    <ul role="list" className="mt-6 flex flex-col gap-2">
      {list.map((item) => (
        <li key={item.id}>
          <button
            onClick={() => onItemClick(item)}
            type="button"
            className="group flex w-full items-center justify-between space-x-3 rounded-full border border-gray-300 p-2 text-left shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
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
              <span className="block min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-gray-900">
                  {item.name}
                </span>
                <span className="block truncate text-sm font-medium text-gray-500">
                  {item.artist}
                </span>
              </span>
            </span>
            <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center">
              <MinusIcon
                className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
};
