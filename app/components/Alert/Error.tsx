import { Transition } from "@headlessui/react";
import { XCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Fragment, useEffect, useState } from "react";

export default function ErrorAlert({
  children,
}: {
  children: React.ReactNode;
}) {
  let [isOpen, setIsOpen] = useState(true);

  // fade out transition with tailwind classes after 5 seconds
  useEffect(() => {
    let timeout = setTimeout(() => setIsOpen(false), 5000);
    return () => clearTimeout(timeout);
  }, []);

  function closeAlert() {
    setIsOpen(false);
  }
  return (
    <Transition
      as={Fragment}
      show={isOpen}
      leave='transform duration-200 transition ease-in-out'
      leaveFrom='opacity-100 rotate-0 scale-100 '
      leaveTo='opacity-0 scale-95 '>
      <div className='rounded-md bg-red-50  p-4'>
        <div className='flex'>
          <div className='flex-shrink-0'>
            <XCircleIcon className='h-5 w-5 text-red-400' aria-hidden='true' />
          </div>
          <div className='ml-3'>
            <p className='text-sm font-medium text-red-800'>{children}</p>
          </div>
          <div className='ml-auto pl-3'>
            <div className='-mx-1.5 -my-1.5'>
              <button
                type='button'
                onClick={closeAlert}
                className='inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50'>
                <span className='sr-only'>Dismiss</span>
                <XMarkIcon className='h-5 w-5' aria-hidden='true' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}
