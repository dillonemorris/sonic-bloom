"use client";

import { useState } from "react";
import { PaginationWithCreateLink } from "./PaginationWithCreateLink";
import { TrackList } from "./TrackList";

export const TrackSelection = () => {
  const [pageIndex, setPageIndex] = useState(0);

  return (
    <>
      <TrackList pageIndex={pageIndex} />
      <div className="mt-6">
        <PaginationWithCreateLink
          pageIndex={pageIndex}
          onNextClick={() => setPageIndex((index) => index + 1)}
          onPrevClick={() => setPageIndex((index) => index - 1)}
        />
      </div>
    </>
  );
};
