import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PaymentMethodBtn({
  name,
  icon,
  active = false,
  onClick,
}: {
  name: string;
  icon: IconDefinition;
  active: boolean;
  onClick: Function;
}) {
  return (
    <button
      className={`py-4 px-6 flex items-center rounded-lg border border-solid text-lg font-medium transition-colors ${
        active
          ? "border-indigo-600"
          : "border-gray-300 dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-800 cursor-pointer"
      }`}
      onClick={() => onClick()}
      disabled={active}
    >
      <span className="grow">{name}</span>
      <FontAwesomeIcon icon={icon} />
    </button>
  );
}
