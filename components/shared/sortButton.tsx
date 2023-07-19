import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SortButton({
  title,
  value,
  order,
  orderBy,
}: {
  title: string;
  value: string;
  order: string;
  orderBy: string;
}) {
  let isActive = value === orderBy;
  let isDesc = order === "desc";

  return (
    <button className="select-none cursor-pointer">
      <span>{title}</span>
      {!isActive ? null : isDesc ? (
        <FontAwesomeIcon
          icon={faArrowDown}
          className="ml-2 text-sm text-gray-400 dark:text-zinc-500"
        />
      ) : (
        <FontAwesomeIcon
          icon={faArrowUp}
          className="ml-2 text-sm text-gray-400 dark:text-zinc-500"
        />
      )}
    </button>
  );
}
