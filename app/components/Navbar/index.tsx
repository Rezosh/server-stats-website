import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  ServerStackIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { User } from "@prisma/client";
import { Link, NavLink } from "@remix-run/react";
import { Fragment } from "react";
import { FaDiscord } from "react-icons/fa";
import { MdArrowDropDown } from "react-icons/md";
import { classNames } from "~/utils/helperFunctons";

type NavbarProps = {
  user: User;
};

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Servers", href: "/servers?page=1" },
  { name: "Commands", href: "/commands" },
  { name: "Support Discord", href: "/discord" },
];

const userLinks = [
  { name: "Manage Guilds", href: "/guilds/manage" },
  { name: "Your Notifs", href: "/notifs" },
];

export default function Navbar({ user }: NavbarProps) {
  return (
    <Disclosure as='nav' className='bg-slate-800/60'>
      {({ open }) => (
        <>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='flex h-16 items-center justify-between'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  {/* Logo */}

                  <ServerStackIcon className='block h-8 w-auto text-indigo-500' />
                </div>
                <div className='hidden sm:ml-6 sm:block'>
                  <div className='flex space-x-4'>
                    {navLinks.map((link) => (
                      <NavLink
                        key={link.name}
                        to={link.href}
                        className={({ isActive }) =>
                          classNames(
                            isActive
                              ? "bg-slate-900 text-white"
                              : "text-slate-50 hover:bg-slate-700 hover:text-white",
                            "px-3 py-2 rounded-md text-sm font-medium"
                          )
                        }>
                        {link.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
              <div className='hidden sm:ml-6 sm:block'>
                <div className='flex items-center'>
                  {/* Profile dropdown */}
                  {user ? (
                    <Menu as='div' className='relative ml-3'>
                      <div>
                        <Menu.Button className='flex items-center rounded-full  text-sm focus:outline-none focus:ring-2 focus:ring-slate-50 focus:ring-offset-2 focus:ring-offset-slate-800'>
                          <span className='sr-only'>Open user menu</span>
                          <img
                            className='h-8 w-8 rounded-full'
                            src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`}
                            alt=''
                          />
                          <span className='text-slate-300 font-medium ml-2 pr-2 inline-flex items-center'>
                            {user.username}

                            <MdArrowDropDown
                              className='h-4 w-4 ml-2'
                              aria-hidden='true'
                            />
                          </span>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter='transition ease-out duration-100'
                        enterFrom='transform opacity-0 scale-95'
                        enterTo='transform opacity-100 scale-100'
                        leave='transition ease-in duration-75'
                        leaveFrom='transform opacity-100 scale-100'
                        leaveTo='transform opacity-0 scale-95'>
                        <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-slate-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                          {userLinks.map((link) => (
                            <Menu.Item key={link.name}>
                              {({ active }) => (
                                <NavLink
                                  key={link.name}
                                  to={link.href}
                                  className={classNames(
                                    active ? "bg-slate-700" : "",
                                    "block px-4 py-2 text-sm text-slate-50"
                                  )}>
                                  {link.name}
                                </NavLink>
                              )}
                            </Menu.Item>
                          ))}

                          <Menu.Item>
                            {({ active }) => (
                              <form method='POST' action='/logout'>
                                <button
                                  type='submit'
                                  className={classNames(
                                    active ? "bg-slate-700" : "",
                                    "block w-full text-left px-4 py-2 text-sm text-red-400"
                                  )}>
                                  Sign out
                                </button>
                              </form>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ) : (
                    <Link
                      to='/login'
                      className='bg-[#454FBF] hover:bg-[#5865F2] hover:cursor-pointer text-slate-300 justify-center px-3 py-2 rounded-md text-sm font-medium inline-flex items-center'>
                      <FaDiscord className='-ml-1 mr-2 h-5 w-5' />
                      Log In
                    </Link>
                  )}
                </div>
              </div>
              <div className='-mr-2 flex sm:hidden'>
                {/* Mobile menu button */}
                <Disclosure.Button className='inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'>
                  <span className='sr-only'>Open main menu</span>
                  {open ? (
                    <XMarkIcon className='block h-6 w-6' aria-hidden='true' />
                  ) : (
                    <Bars3Icon className='block h-6 w-6' aria-hidden='true' />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className='md:hidden'>
            <div className='space-y-1 px-2 pt-2 pb-3'>
              {navLinks.map((link) => (
                <Disclosure.Button
                  as={NavLink}
                  key={link.name}
                  to={link.href}
                  className='text-slate-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium'>
                  {link.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className='border-t border-slate-700 pt-4 pb-3'>
              <div className='flex items-center px-5'>
                {user ? (
                  <>
                    <div className='flex-shrink-0'>
                      <img
                        className='h-10 w-10 rounded-full'
                        src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`}
                        alt='guild icon'
                      />
                    </div>
                    <div className='ml-3'>
                      <div className='text-base font-medium text-white'>
                        {user.username}
                      </div>
                      <div className='text-sm font-medium text-slate-400'>
                        #{user.discriminator}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    to='/login'
                    className='bg-[#454FBF] hover:bg-[#5865F2] hover:cursor-pointer text-slate-300 justify-center px-3 py-3 rounded-md text-sm font-medium inline-flex items-center w-full'>
                    <FaDiscord className='-ml-1 mr-2 h-5 w-5' />
                    Log In
                  </Link>
                )}
              </div>
              {user ? (
                <div className='mt-3 space-y-1 px-2'>
                  {userLinks.map((link) => (
                    <Disclosure.Button
                      key={link.name}
                      as={Link}
                      to={link.href}
                      className='block rounded-md px-3 py-2 text-base font-medium text-slate-400 hover:bg-slate-700 hover:text-white'>
                      {link.name}
                    </Disclosure.Button>
                  ))}
                  <form method='POST' action='/logout'>
                    <button
                      type='submit'
                      className='block rounded-md px-3 py-2 text-left font-medium text-red-500 hover:bg-slate-700 hover:text-white w-full'>
                      Sign out
                    </button>
                  </form>
                </div>
              ) : null}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
