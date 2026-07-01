import { useEffect, useState } from 'react'
import { get_all_books } from '../services/api';
import defaultImage from '../assets/images/default.png';
import { useNavigate } from 'react-router-dom';

const STATUS_STYLE: Record<string, string> = {
  processed: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  failed: 'bg-red-100 text-red-700',
};

const displayName = (name: string) => name.replace(/\.pdf$/i, '');

const Books = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    get_all_books()
      .then(setBooks)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-full bg-slate-200 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-slate-800 text-white rounded-xl px-6 py-5 text-center mb-8 shadow-lg">
          <h1 className="text-2xl font-semibold tracking-wide">All Books</h1>
          <p className="text-slate-400 text-sm mt-1">{books.length} book{books.length !== 1 ? 's' : ''} in your library</p>
        </div>

        {loading ? (
          <p className="text-center text-slate-500">Loading...</p>
        ) : books.length === 0 ? (
          <p className="text-center text-slate-500">No books yet. Upload one from the home page.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                onClick={() => navigate(`/book/${book.id}`)}
                className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden cursor-pointer hover:shadow-xl hover:border-amber-400 transition-all"
              >
                <div className="h-52 bg-amber-50 flex items-center justify-center p-4">
                  <img
                    src={book.image || defaultImage}
                    alt={book.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="px-4 py-3 border-t border-slate-100">
                  <h2 className="font-semibold text-slate-800 truncate" title={book.name}>
                    {displayName(book.name)}
                  </h2>
                  <div className="flex items-center justify-between mt-2">
                    {book.total_pages && (
                      <span className="text-xs text-slate-500">{book.total_pages} pages</span>
                    )}
                    {book.upload_status && (
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[book.upload_status] || 'bg-slate-100 text-slate-600'}`}>
                        {book.upload_status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;
