import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { get_book_by_id, get_book_page } from '../services/api';
import AudioControls from './AudioControls';

const LANG_LABEL: Record<string, string> = { en: 'English', fa: 'فارسی' };

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState<any>(null);
    const [pageRec, setPageRec] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLoading, setPageLoading] = useState(false);

    useEffect(() => {
        if (!id) return;
        setBook(null);
        setPageRec(null);
        setCurrentPage(1);
        get_book_by_id(id).then((data) => {
            setBook(data);
            setPageRec(data.first_page_rec);
        });
    }, [id]);

    const loadPage = async (pageNum: number) => {
        if (!id || pageLoading) return;
        setPageLoading(true);
        try {
            const page = await get_book_page(id, pageNum);
            setPageRec(page);
            setCurrentPage(pageNum);
        } finally {
            setPageLoading(false);
        }
    };

    if (!book) return <div className="min-h-full bg-slate-200 p-6 text-center text-slate-500">Loading...</div>;

    const totalPages = book.total_pages || 1;
    const showNav = totalPages > 1;

    if (!pageRec) {
        return (
            <div className="min-h-full bg-slate-200 p-6 text-center text-slate-500">
                Page content not ready yet.
            </div>
        );
    }

    const resolvedData = JSON.parse(pageRec.content).content;
    const languages: string[] = pageRec.language
        ? pageRec.language.split(',').map((l: string) => l.trim())
        : [];
    const rowCount = Math.max(...languages.map((lang) => (resolvedData[lang] || []).length), 0);

    return (
        <div className="min-h-full bg-slate-200 flex justify-center items-start py-8 px-4 relative">
            {showNav && (
                <button
                    onClick={() => loadPage(currentPage - 1)}
                    disabled={currentPage <= 1 || pageLoading}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-slate-50 disabled:opacity-40 z-10"
                >
                    <FaChevronLeft size={20} />
                </button>
            )}

            <div className="w-full max-w-3xl flex flex-col rounded-xl shadow-2xl border border-slate-300 overflow-hidden">
                <div className="shrink-0 bg-slate-800 text-white px-6 py-4 text-center">
                    <h1 className="text-xl font-semibold tracking-wide">{book.name}</h1>
                    <span className="inline-block mt-2 text-xs bg-slate-600 px-3 py-1 rounded-full">
                        Page {currentPage} of {totalPages}
                    </span>
                    <AudioControls page={currentPage} bookId={id} />
                </div>

                <div className="flex-1 overflow-y-auto bg-amber-50 px-8 py-8 font-serif text-slate-800 leading-relaxed max-h-[60vh]">
                    {pageLoading ? (
                        <p className="text-center text-slate-500">Loading page...</p>
                    ) : languages.length === 1 ? (
                        <div className="max-w-prose mx-auto space-y-3">
                            {(resolvedData[languages[0]] || []).map((block: any, idx: number) => (
                                <p key={idx} dir={languages[0] === 'fa' ? 'rtl' : 'ltr'}>
                                    {block.text}
                                </p>
                            ))}
                        </div>
                    ) : (
                        <div>
                            <div className={`grid ${languages.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-4 mb-6 pb-2 border-b border-slate-300`}>
                                {languages.map((lang) => (
                                    <span key={lang} className="text-xs font-sans font-bold uppercase tracking-wider text-slate-500 text-center">
                                        {LANG_LABEL[lang] || lang}
                                    </span>
                                ))}
                            </div>
                            <div className="space-y-4">
                                {Array.from({ length: rowCount }).map((_, idx) => (
                                    <div key={idx} className={`grid ${languages.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
                                        {languages.map((lang) => (
                                            <p key={lang} dir={lang === 'fa' ? 'rtl' : 'ltr'} className={lang === 'fa' ? 'text-right' : 'text-left'}>
                                                {resolvedData[lang]?.[idx]?.text ?? ''}
                                            </p>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showNav && (
                <button
                    onClick={() => loadPage(currentPage + 1)}
                    disabled={currentPage >= totalPages || pageLoading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-slate-50 disabled:opacity-40 z-10"
                >
                    <FaChevronRight size={20} />
                </button>
            )}
        </div>
    );
}

export default BookDetails
