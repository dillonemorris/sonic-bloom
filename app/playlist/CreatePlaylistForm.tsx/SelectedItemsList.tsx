import { useSelectedItems } from "@/app/Providers";
import { MinusIcon } from "@heroicons/react/24/outline";
import Item from "@/app/Item";

export const SelectedItemsList = () => {
  const { list } = useSelectedItems();
  return (
    <ul role="list" className="mt-6 flex flex-col gap-2">
      {list.map((item) => (
        <Item item={item} icon={<ItemIcon />} key={item.id}>
          <Item.Name />
          <Item.Details />
        </Item>
      ))}
    </ul>
  );
};

const ItemIcon = () => {
  return (
    <MinusIcon
      className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
      aria-hidden="true"
    />
  );
};
