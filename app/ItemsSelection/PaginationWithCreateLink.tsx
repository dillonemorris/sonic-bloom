import Link from "next/link";
import { useSelectedItems } from "../Providers";

const MAX_SELECTED_ITEMS = 5;

type Props = {
  pageIndex: number;
  onNextClick: () => void;
  onPrevClick: () => void;
};

export const PaginationWithCreateLink = ({
  pageIndex,
  onNextClick,
  onPrevClick,
}: Props) => {
  const { list } = useSelectedItems();

  return (
    <nav
      className="flex items-center justify-between border-t border-gray-200 bg-white py-3"
      aria-label="Pagination"
    >
      <div className="hidden sm:block font-semibold">
        <p className="text-sm text-gray-700">
          {list.length} of {MAX_SELECTED_ITEMS} items selected
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        <button
          disabled={pageIndex === 0}
          onClick={onPrevClick}
          className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus-visible:outline-offset-0 ${
            pageIndex === 0
              ? "bg-gray-100 hover:bg-gray-100"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          Previous
        </button>
        <button
          onClick={onNextClick}
          className="ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
        >
          Next
        </button>
        <Link
          href="/playlist"
          className={`ml-3 top-6 right-6 inline-flex items-center gap-x-1.5 rounded-md px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${
            list.length > 0
              ? "bg-neutral-950 text-white hover:bg-neutral-800 ring-neutral-950"
              : "pointer-events-none"
          }`}
        >
          Create Playlist
        </Link>
      </div>
    </nav>
  );
};
