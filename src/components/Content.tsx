import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

type Props = {
  data: string;
  onNext: () => void;
  onPrev: () => void;
  page: number;
  totalPages: number;
};

const Content: React.FC<Props> = ({ data, onNext, onPrev, page, totalPages }) => {
    const extractChapters = (chapterString: string, strategy = 'all') => {
        // This regex matches:
        // 1. Chapter number (\d+)
        // 2. Dot and spaces (\.\s*)
        // 3. Title (captures everything until next chapter number or end of string)
        const chapterRegex = /(\d+)\.\s*([\s\S]+?)(?=\s*\d+\.|$)/g;
        
        const chapters: string[] = [];
        let match: RegExpExecArray | null;
        
        while ((match = chapterRegex.exec(chapterString)) !== null) {
            const number = match[1];
            const title = match[2].trim();
            chapters.push(`${number}. ${title}`);
        }

        return chapters;
    }
    const lines = extractChapters(data)

  return (
    <div className="flex justify-center items-center h-full w-full px-6 py-8 overflow-y-auto bg-gray-100 relative">
      
      {/* Left Arrow */}
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-200 disabled:opacity-40"
      >
        <FaChevronLeft size={20} />
      </button>

      {/* Main Content */}
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Page {page} of {totalPages}
          </h2>
        </div>
        <div className="text-lg leading-relaxed text-gray-800 whitespace-pre-wrap">
                  {lines.length > 0 ? (
                      <ul className="space-y-1 list-none text-gray-800 text-lg">
                          {lines.map((line, idx) => (
                              <li key={idx}>{line}</li>
                          ))}
                      </ul>
                  ) : (
                      <div className="text-gray-800 text-lg">
                          {/* Your fallback content here */}
                          {data}
                      </div>
                  )}
        </div>
      </div>

      {/* Right Arrow */}
      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-200 disabled:opacity-40"
      >
        <FaChevronRight size={20} />
      </button>
    </div>
  );
};

export default Content;
