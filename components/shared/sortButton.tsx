import {
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SortButton({
  title,
  value,
  state,
}: {
  title: string;
  value: string;
  state: string;
}) {
  return (
    <span className="SortTrigger select-none">
      <span>{title}</span>
      {state !== value && state !== "~" + value ? (
        <FontAwesomeIcon
          icon={faSort}
          className="SortIcon hidden ml-2 text-gray-200 dark:text-zinc-700"
        />
      ) : state === value ? (
        <FontAwesomeIcon icon={faSortDown} className="ml-2" />
      ) : (
        <FontAwesomeIcon icon={faSortUp} className="ml-2" />
      )}
    </span>
  );
}
