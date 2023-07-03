import {
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
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
    <span className="SortTrigger select-none">
      <span>{title}</span>
      {!isActive ? (
        <FontAwesomeIcon
          icon={faSort}
          className="SortIcon hidden ml-2 text-gray-200 dark:text-zinc-700"
        />
      ) : isDesc ? (
        <FontAwesomeIcon icon={faSortDown} className="ml-2" />
      ) : (
        <FontAwesomeIcon icon={faSortUp} className="ml-2" />
      )}
    </span>
  );
}
