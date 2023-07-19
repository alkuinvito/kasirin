import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export default function Pagination({
  limit = 5,
  rowsPerPage = 25,
  dataLength,
  page,
  onChangePage,
}: {
  limit?: number;
  rowsPerPage?: number;
  dataLength: number;
  page: number;
  onChangePage: Function;
}) {
  const low = Math.floor(page / limit) * limit;
  const high =
    low + limit <= Math.floor(dataLength / rowsPerPage) + 1
      ? limit
      : Math.floor(dataLength / rowsPerPage) + 1 - low;

  return (
    <div className="flex justify-center items-center gap-2">
      <button
        className="w-8 h-8 rounded-full cursor-pointer text-center hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:cursor-default disabled:text-gray-300 dark:disabled:text-zinc-700 disabled:hover:bg-transparent disabled:dark:hover:bg-transparent transition-colors"
        onClick={() => onChangePage(page - 1)}
        disabled={page === 0}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      {[...Array(high)].map((v, i) => (
        <button
          key={low + i}
          onClick={() => {
            onChangePage(low + i);
          }}
          className={
            low + i === page
              ? "min-w-[1.4rem] px-2 py-[0.1rem] rounded-lg select-none text-center leading-8 text-white bg-indigo-500 dark:bg-indigo-700"
              : "min-w-[1.4rem] px-2 py-[0.1rem] rounded-lg select-none text-center leading-8 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
          }
        >
          {low + i + 1}
        </button>
      ))}
      <button
        className="w-8 h-8 rounded-full cursor-pointer text-center hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:cursor-default disabled:text-gray-300 dark:disabled:text-zinc-700 disabled:hover:bg-transparent disabled:dark:hover:bg-transparent transition-colors"
        onClick={() => onChangePage(page + 1)}
        disabled={page === Math.floor((dataLength || 0) / rowsPerPage)}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
}
