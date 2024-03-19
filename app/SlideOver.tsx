"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CreatePlaylistForm } from "./CreatePlaylistForm";
import { useSelectedTracks } from "./Providers";

const MAX_SEEDS = 5;

export const SlideOver = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { list } = useSelectedTracks();
  // TODO: Add to context
  const isSelecting = !!list.length;
  const doesListExceedMax = list.length > MAX_SEEDS;
  const activeRingClasses = `ring-teal-500 ring-2 bg-gray-50 ${
    doesListExceedMax && "ring-pink-400"
  }`;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`absolute top-6 right-6 inline-flex items-center gap-x-1.5 rounded-full  px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${
          isSelecting ? activeRingClasses : null
        }`}
      >
        <PlusIcon
          className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
          aria-hidden="true"
        />
        New Playlist
      </button>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <div className="fixed inset-0" />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-lg">
                    <CreatePlaylistForm>
                      <div className="flex h-7 items-center">
                        <button
                          type="button"
                          className="relative text-gray-400 hover:text-gray-500"
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </CreatePlaylistForm>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};
