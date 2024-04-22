import { Item as ItemType, useSelectedItems } from "../Providers";
import { MAX_ITEMS } from "./constants";
import Item from "../Item";
import { PlusIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/24/outline";

type ItemsListProps = { items: ItemType[] };

export const ItemsList = ({ items }: ItemsListProps) => {
  const { isSelected, list } = useSelectedItems();

  return (
    <ul role="list" className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((item) => {
        return (
          <Item
            item={item}
            disabled={!isSelected(item) && list.length === MAX_ITEMS}
            className={
              isSelected(item)
                ? "bg-neutral-950 hover:bg-neutral-950 border-gray-950"
                : undefined
            }
            icon={<ItemIcon item={item} />}
            key={item.id}
          >
            <Item.Name
              className={isSelected(item) ? "text-white" : undefined}
            />
            <Item.Details
              className={isSelected(item) ? "text-slate-400" : undefined}
            />
          </Item>
        );
      })}
    </ul>
  );
};

const ItemIcon = ({ item }: { item: ItemType }) => {
  const { isSelected } = useSelectedItems();
  const Icon = isSelected(item) ? CheckIcon : PlusIcon;
  return (
    <Icon
      className={`h-5 w-5 text-gray-400 group-hover:text-gray-500 ${
        isSelected(item) && "text-white group-hover:text-white stroke-2"
      }`}
      aria-hidden="true"
    />
  );
};
