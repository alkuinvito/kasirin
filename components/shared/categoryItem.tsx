import { ReactNode } from "react";

export default function CategoryItem({
  children,
  onClick,
  active = false,
}: {
  children?: ReactNode;
  onClick?: Function;
  active?: boolean;
}) {
  if (onClick) {
    if (active) {
      return (
        <button
          onClick={() => onClick()}
          className="rounded-lg px-4 py-2 mr-4 cursor-pointer font-medium bg-indigo-600 dark:bg-indigo-800 hover:bg-indigo-700 dark:hover:bg-indigo-900 text-white transition-colors"
        >
          {children}
        </button>
      );
    }

    return (
      <button
        onClick={() => onClick()}
        className="rounded-lg px-4 py-2 mr-4 cursor-pointer font-medium bg-gray-200 dark:bg-zinc-800 hover:bg-indigo-700 dark:hover:bg-indigo-900 hover:text-white transition-colors"
      >
        {children}
      </button>
    );
  }

  if (active) {
    return (
      <button className="rounded-lg px-4 py-2 mr-4 cursor-pointer font-medium bg-indigo-600 dark:bg-indigo-800 hover:bg-indigo-700 dark:hover:bg-indigo-900 text-white transition-colors">
        {children}
      </button>
    );
  }

  return (
    <button className="rounded-lg px-4 py-2 mr-4 cursor-pointer font-medium bg-gray-200 dark:bg-zinc-800 hover:bg-indigo-700 dark:hover:bg-indigo-900 hover:text-white transition-colors">
      {children}
    </button>
  );
}
