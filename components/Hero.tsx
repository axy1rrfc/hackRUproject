'use client';

import Image from 'next/image';
import NavLink from './NavLink';

let heroImages = ['/1.png', '/6.png', '/3.png', '/4.png', '/5.png', '/2.png'];

export default function Hero() {
  return (
    <section>
      <div className="custom-screen pt-28 text-green-700">
        <div className="space-y-5 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl text-green-700 font-extrabold mx-auto sm:text-6xl">
            R U Allergic?
          </h1>
          <p className="max-w-xl mx-auto">
            With ruAllergic, find your allergies in seconds!
          </p>
          <div className="flex items-center justify-center gap-x-3 font-medium text-sm">
            <NavLink
              href="/start"
              className="text-green-700 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 "
            >
              Find Out Now
            </NavLink>
            <NavLink
              target="_blank"
              href="https://github.com/axy1rrfc/hackRUproject.git"
              className="text-green-700 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 "
              scroll={false}
            >
              Learn more
            </NavLink>
          </div>
          <div className="grid sm:grid-cols-3 grid-cols-2 gap-4 pt-10">
            {heroImages.map((image, idx) => (
              <Image
                key={idx}
                alt="image"
                src={image}
                width={500}
                height={500}
                className="rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
