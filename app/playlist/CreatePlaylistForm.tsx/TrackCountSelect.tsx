type TrackCountSelectProps = {
  trackCount: string;
  setTrackCount: (count: string) => void;
};

export const TrackCountSelect = ({
  trackCount,
  setTrackCount,
}: TrackCountSelectProps) => {
  return (
    <>
      <label
        htmlFor="trackCount"
        className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5 mb-2"
      >
        Number of tracks
      </label>
      <select
        id="trackCount"
        name="trackCount"
        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-grey-600 sm:text-sm sm:leading-6"
        value={trackCount}
        onChange={(e) => setTrackCount(e.target.value)}
      >
        <option>20</option>
        <option>25</option>
        <option>30</option>
        <option>40</option>
        <option>50</option>
        <option>100</option>
      </select>
    </>
  );
};
