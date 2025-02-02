'use client';

import Image from 'next/image';
import NavLink from './NavLink';



export default function Hero() {
  return (
    <section>
    <div className="relative w-full min-h-screen bg-custom flex flex-col items-center justify-center p-6 bg-fixed">
    <div className="absolute z-0 inset-0 bg-green-900 opacity-75"></div>
    <div className="relative z-10 flex flex-col items-center justify-center">
      <div className="custom-screen pt-28 text-green-700">
        <div className="space-y-5 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl text-yellow-500 font-extrabold mx-auto sm:text-8xl">
            R U Allergic?
          </h1>
          <p className="inline-block bg-yellow-500 text-green-700 font-semibold text-lg px-6 py-3 rounded-lg shadow-md">
            With RUAllergic, find your allergies in seconds!
          </p>
          <div className="flex items-center justify-center gap-x-3 font-medium text-sm">
            <NavLink
              href="/start"
              className="px-6 py-2 text-lg w-48 text-green-700 bg-yellow-500 rounded-lg hover:scale-105 transition-transform duration-300"
            >
              Find Out Now
            </NavLink>
            <NavLink
              href="/about"
              className="px-6 py-2 text-lg w-48 text-green-700 bg-yellow-500 rounded-lg hover:scale-105 transition-transform duration-300"
            >
              Learn more
            </NavLink>
          </div>
        </div>
      </div>
      </div>
      </div>
    </section>
  );
}
