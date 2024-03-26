import { TRACKS_PER_PAGE } from "./constants";
import { PlusIcon } from "@heroicons/react/16/solid";

export const TrackListSkeleton = () => {
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
