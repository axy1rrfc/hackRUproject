'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import NavLink from './NavLink';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';

const Navbar = () => {
  const [state, setState] = useState(false);

  const navigation = [
    // { title: 'Testimonials', path: '#testimonials' },
    { title: 'Home', path: '/' },
  ];

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Add closing the navbar menu when navigating
    const handleState = () => {
      document.body.classList.remove('overflow-hidden');
      setState(false);
    };

    handleState();
  }, [pathname, searchParams]);

  const handleNavMenu = () => {
    setState(!state);
    document.body.classList.toggle('overflow-hidden');
  };

  return (
    <header>
      <nav
        className={`bg-yellow-500 w-full md:static md:text-sm ${
          state ? 'fixed z-10 h-full' : ''
        }`}
      >
        <div className="custom-screen items-center mx-auto md:flex">
          <div className="flex items-center justify-between py-8 md:py-3 md:block">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/foodicon.svg"
                alt="logo"
                width={33}
                height={33}
                className="border-4 border-green-700 rounded-full"
              />
              <div className="text-green-700 font-bold text-lg">RUAllergic</div>
            </Link>
            <div className="md:hidden">
              <button
                role="button"
                aria-label="Open the menu"
                className="text-gray-500 hover:text-gray-800"
                onClick={handleNavMenu}
              ></button>
            </div>
          </div>
          <div
            className={`flex-1 pb-3 mt-8 md:pb-0 md:mt-0 md:block ${
              state ? '' : 'hidden'
            }`}
          >
            <ul className="text-green-700 justify-end items-center space-y-6 md:flex md:space-x-6 md:space-y-0 md:text-gray-600 md:font-medium">
              {navigation.map((item, idx) => {
                return (
                  <li key={idx} className="text-green-700 text-base">
                    <Link href={item.path} className="block">
                      {item.title}
                    </Link>
                  </li>
                );
              })}
              <li>
                <NavLink
                  href="/start"
                  className="block font-medium text-md text-yellow-500 bg-green-800 hover:scale-105 "
                >
                  Find Out Now
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
