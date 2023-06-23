import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function NavItem({
  icon,
  title,
  href,
  active = false,
}: {
  icon: IconDefinition;
  title: string;
  href: string;
  active?: boolean;
}) {
  if (active) {
    return (
      <Link
        href={href}
        className="px-4 py-3 rounded-lg text-lg font-medium text-white bg-indigo-600 dark:bg-indigo-800 hover:bg-indigo-700 dark:hover:bg-indigo-900 flex items-center gap-4"
      >
        <div className="flex justify-center w-6">
          <FontAwesomeIcon icon={icon} />
        </div>
        <span>{title}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="px-4 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 flex items-center gap-4"
    >
      <div className="flex justify-center w-6">
        <FontAwesomeIcon icon={icon} />
      </div>
      <span>{title}</span>
    </Link>
  );
}
