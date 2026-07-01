import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

type Props = {
  data: {"pages": any};
  onNext: () => void;
  onPrev: () => void;
  page: number;
  totalPages: number;
};

const Content: React.FC<Props> = ({ data, onNext, onPrev, page, totalPages }) => {
  console.log(data)
  const resolvedPages = totalPages;
  console.log(page)
  let resolvedData = data["pages"][Number(page)].content
  let languages = data["pages"][Number(page)].languages;
  console.log(page, resolvedPages);
  console.log(languages);
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
      <div>{page+1} of {resolvedPages}</div> <br />
      <div className="text-lg leading-relaxed text-gray-800">
        {/* {(languages > 1 && resolvedData.en || []).map((_: any, index:number) => {
          if (page === 1 && index === 0) return null;

          return (
            <div
              key={index}
              className="flex flex-row justify-between gap-8 mb-4"
            >

              <li className="w-1/2 text-left">
                {resolvedData.en[index].text}
              </li>


              <li className="w-1/2 text-right" dir="rtl">
                {resolvedData.fa[index]?.text}
              </li>
            </div>
          );
        })} */}
        {
          languages.map((lang: string, index: number) => {
            return resolvedData[lang].map((_: any, idx:number) => {
              return (
                <div
                  key={idx}
                  className="flex flex-row justify-between gap-8 mb-2">
                    <p className={`w-${languages.length==1 ? 'full' : "1/" + languages.length} text-${lang === 'fa' ? 'right' : 'left'}`} dir={lang === 'fa' ? 'rtl' : 'ltr'}>
                      {resolvedData[lang][idx].text}
                    </p>
                  </div>
              )
            })
          })
        }
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
