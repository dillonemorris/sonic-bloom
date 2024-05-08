import classNames from "classnames";
import { ActiveTypeState } from ".";

const tabs: { name: string; value: ActiveTypeState }[] = [
  { name: "songs", value: "tracks" },
  { name: "artists", value: "artists" },
];

type ActiveTypeTabsProps = {
  activeType: ActiveTypeState;
  onTabClick: (type: ActiveTypeState) => void;
};

export const ActiveTypeTabs = ({
  activeType,
  onTabClick,
}: ActiveTypeTabsProps) => {
  return (
    <nav className="flex space-x-4" aria-label="Tabs">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => onTabClick(tab.value)}
          className={classNames(
            activeType === tab.value
              ? "bg-neutral-950 hover:bg-neutral-950 border-gray-950 text-white"
              : "text-gray-600 hover:text-gray-800",
            "rounded-md px-3 py-2 text-sm font-medium capitalize"
          )}
        >
          {tab.name}
        </button>
      ))}
    </nav>
  );
};
