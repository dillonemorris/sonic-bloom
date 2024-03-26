import { ArrowPathIcon } from "@heroicons/react/24/outline";

export const SubmitButton = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <button
      type="submit"
      className="inline-flex justify-center rounded-md bg-neutral-950 p-3 text-sm font-semibold text-white shadow-sm hover:bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 w-full"
    >
      {isLoading ? (
        <ArrowPathIcon className="w-5 h-5 animate-spin mr-2" />
      ) : null}
      {isLoading ? "Loading..." : "Create"}
    </button>
  );
};
