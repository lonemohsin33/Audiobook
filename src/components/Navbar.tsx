import { NavLink, useNavigate } from 'react-router-dom';
import { FaBook, FaHome, FaUser } from 'react-icons/fa';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
  }`;

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="shrink-0 bg-slate-800 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-lg font-semibold tracking-wide hover:text-slate-200 transition-colors"
        >
          <FaBook className="text-amber-400" />
          AudioBook
        </button>

        <div className="flex items-center gap-2">
          <NavLink to="/" end className={linkClass}>
            <FaHome size={14} />
            Home
          </NavLink>
          <NavLink to="/books" className={linkClass}>
            <FaBook size={14} />
            Books
          </NavLink>
        </div>

        <div className="w-9 h-9 rounded-full bg-slate-600 flex items-center justify-center text-slate-300">
          <FaUser size={16} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
