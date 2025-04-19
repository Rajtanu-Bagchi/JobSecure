import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import { toggleTheme } from '../../store/slices/uiSlice';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { theme } = useSelector(state => state.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const navigation = [
    { name: 'Home', href: '/', current: false },
    { name: 'Find Jobs', href: isAuthenticated ? '/jobs' : '/register', current: false },
  ];

  const userNavigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Profile', href: '/profile' },
    { name: 'Settings', href: '/settings' },
  ];

  if (user?.role === 'admin') {
    userNavigation.push({ name: 'Admin Panel', href: '/admin' });
  }

  return (
    <Disclosure as="nav" className="bg-white dark:bg-secondary-900 shadow-md">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/" className="flex items-center">
                    <img
                      className="h-10 w-auto"
                      src="/assets/logo.svg"
                      alt="JobSecure"
                    />
                    <span className="ml-2 text-xl font-bold text-secondary-900 dark:text-white">JobSecure</span>
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-secondary-600 hover:text-primary-600 dark:text-secondary-200 dark:hover:text-primary-400"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <button
                  type="button"
                  className="rounded-full bg-white dark:bg-secondary-800 p-1 text-secondary-500 hover:text-primary-600 dark:text-secondary-300 dark:hover:text-primary-400 focus:outline-none"
                  onClick={handleThemeToggle}
                >
                  {theme === 'dark' ? (
                    <SunIcon className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MoonIcon className="h-6 w-6" aria-hidden="true" />
                  )}
                </button>

                {isAuthenticated ? (
                  <Menu as="div" className="relative ml-6">
                    <div>
                      <Menu.Button className="flex rounded-full bg-white dark:bg-secondary-800 text-sm focus:outline-none">
                        <span className="sr-only">Open user menu</span>
                        <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                          {user?.name?.charAt(0) || 'U'}
                        </div>
                      </Menu.Button>
                    </div>
                    <Transition
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-secondary-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                to={item.href}
                                className={`${
                                  active ? 'bg-gray-100 dark:bg-secondary-700' : ''
                                } block px-4 py-2 text-sm text-secondary-700 dark:text-secondary-200`}
                              >
                                {item.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`${
                                active ? 'bg-gray-100 dark:bg-secondary-700' : ''
                              } block w-full text-left px-4 py-2 text-sm text-secondary-700 dark:text-secondary-200`}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <div className="flex items-center ml-6 space-x-4">
                    <Link
                      to="/login"
                      className="text-secondary-600 hover:text-primary-600 dark:text-secondary-200 dark:hover:text-primary-400"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="btn-primary"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-secondary-500 hover:bg-secondary-100 hover:text-secondary-700 dark:text-secondary-300 dark:hover:bg-secondary-800 dark:hover:text-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className="block py-2 pl-3 pr-4 text-base font-medium text-secondary-600 hover:bg-secondary-50 hover:text-primary-600 dark:text-secondary-200 dark:hover:bg-secondary-800 dark:hover:text-primary-400"
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-200 dark:border-secondary-700 pb-3 pt-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-secondary-800 dark:text-white">{user?.name}</div>
                      <div className="text-sm font-medium text-secondary-500 dark:text-secondary-400">{user?.email}</div>
                    </div>
                    <button
                      type="button"
                      className="ml-auto rounded-full bg-white dark:bg-secondary-800 p-1 text-secondary-500 hover:text-primary-600 dark:text-secondary-300 dark:hover:text-primary-400 focus:outline-none"
                      onClick={handleThemeToggle}
                    >
                      {theme === 'dark' ? (
                        <SunIcon className="h-6 w-6" aria-hidden="true" />
                      ) : (
                        <MoonIcon className="h-6 w-6" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  <div className="mt-3 space-y-1">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as={Link}
                        to={item.href}
                        className="block px-4 py-2 text-base font-medium text-secondary-600 hover:bg-secondary-50 hover:text-primary-600 dark:text-secondary-200 dark:hover:bg-secondary-800 dark:hover:text-primary-400"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                    <Disclosure.Button
                      as="button"
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-base font-medium text-secondary-600 hover:bg-secondary-50 hover:text-primary-600 dark:text-secondary-200 dark:hover:bg-secondary-800 dark:hover:text-primary-400"
                    >
                      Sign out
                    </Disclosure.Button>
                  </div>
                </>
              ) : (
                <div className="mt-3 space-y-1 px-2">
                  <Disclosure.Button
                    as={Link}
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-secondary-600 hover:bg-secondary-50 hover:text-primary-600 dark:text-secondary-200 dark:hover:bg-secondary-800 dark:hover:text-primary-400"
                  >
                    Log in
                  </Disclosure.Button>
                  <Disclosure.Button
                    as={Link}
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700"
                  >
                    Sign up
                  </Disclosure.Button>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
