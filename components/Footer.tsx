import { V0Logo } from './v0logo';

const Footer = () => (
  <footer>
    <div className="custom-screen mb-6 mt-6 bg-yellow-500 rounded-full">
      <div className=" px-3 border-4 border-green-700 rounded-full items-center justify-between flex bg-green-700 w-full">
        <p className="text-yellow-500">
          Created by <a>Herschelle Bumrah</a>
          {', '}
          <a></a>Alex Yu <a></a> and <a>Nathaniel Arteaga</a>
        </p>
        <div className="flex items-center gap-x-100 text-yellow-500">
          <a
            className="px-3 py-1 tracking-tight flex gap-1 hover:scale-105 transition"
            href="https://v0.dev/"
            target="_blank"
          >
            <span className="text-yellow-500">Built with</span>
            <V0Logo width={25} />
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
