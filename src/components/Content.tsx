import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

type Props = {
  data: any[];
  onNext: () => void;
  onPrev: () => void;
  page: number;
  totalPages: number;
};

const Content: React.FC<Props> = ({ data, onNext, onPrev, page, totalPages }) => {
  console.log(data)
    let resolvedData = data.length > 0 ? data : JSON.parse(localStorage.getItem("data") || "[]");
  const resolvedPages = totalPages > 0 ? totalPages : JSON.parse(localStorage.getItem("data") || "{}").total_pages || 0;

  console.log(resolvedData);
  resolvedData = resolvedData['pages'][page].content
  console.log(page, resolvedPages);
  console.log(resolvedData);
return (
  <div className="relative h-full w-full bg-gray-100 flex justify-center items-center">

    {/* Left Arrow */}
    <button
      onClick={onPrev}
      disabled={page <= 1}
      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-200 disabled:opacity-40 z-10"
    >
      <FaChevronLeft size={20} />
    </button>

    {/* SCROLLABLE CONTENT ONLY */}
    <div className="h-[80vh] w-full max-w-5xl overflow-y-auto px-6 py-4 bg-gray-100">
      <div>{page} of {resolvedPages}</div> <br />
      <div className="text-lg leading-relaxed text-gray-800">
        {(resolvedData.en || []).map((_: any, index:number) => {
          if (page === 1 && index === 0) return null;

          return (
            <div
              key={index}
              className="flex flex-row justify-between gap-8 mb-4"
            >
              {/* English */}
              <li className="w-1/2 text-left">
                {resolvedData.en[index]}
              </li>

              {/* Persian */}
              <li className="w-1/2 text-right" dir="rtl">
                {resolvedData.fa[index]}
              </li>
            </div>
          );
        })}
      </div>
    </div>

    {/* Right Arrow */}
<button
  onClick={onNext}
  disabled={page >= resolvedPages}
  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-200 disabled:opacity-40 z-10"
>
  <FaChevronRight size={20} />
</button>


  </div>
);
};

export default Content;
