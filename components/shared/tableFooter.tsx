import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export default function TableFooter({
  visibleRowsLength,
  dataLength,
  page,
  rowsPerPage,
  onChangePage,
  onChangeRowsPerPage,
}: {
  visibleRowsLength: number | undefined;
  dataLength: number | undefined;
  page: number;
  rowsPerPage: number;
  onChangePage: Function;
  onChangeRowsPerPage: Function;
}) {
  return (
    <div className="p-3 flex justify-end items-center gap-6">
      <div>
        <span className="mr-2">Rows:</span>
        <select
          name="rows"
          id="rows"
          className="appearance-none pl-3 py-1 rounded-lg dark:bg-zinc-800"
          onChange={(e) => onChangeRowsPerPage(e)}
        >
          <option value="5">5</option>
          <option value="10">10</option>
        </select>
      </div>
      <div>
        <span>
          {page * rowsPerPage + 1}-
          {page * rowsPerPage + (visibleRowsLength || 0)} of {dataLength}
        </span>
      </div>
      <div>
        <button
          className="cursor-pointer disabled:cursor-default disabled:text-gray-300 dark:disabled:text-zinc-700"
          onClick={() => onChangePage(page - 1)}
          disabled={page === 0}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button
          className="ml-4 cursor-pointer disabled:cursor-default disabled:text-gray-300 dark:disabled:text-zinc-700"
          onClick={() => onChangePage(page + 1)}
          disabled={page === Math.floor((dataLength || 0) / rowsPerPage)}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
}
