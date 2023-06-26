import { ReactNode } from "react";

export default function CategoryItem({
  children,
  onClick,
  active = false,
  className,
}: {
  children?: ReactNode;
  onClick?: Function;
  active?: boolean;
  className?: string;
}) {
  if (onClick) {
    if (active) {
      return (
        <button
          onClick={() => onClick()}
          className={
            className
              ? className
              : "rounded-lg px-4 py-2 cursor-pointer font-medium bg-indigo-600 dark:bg-indigo-800 hover:bg-indigo-700 dark:hover:bg-indigo-900 text-white transition-colors"
          }
        >
          {children}
        </button>
      );
    }

    return (
      <button
        onClick={() => onClick()}
        className={
          className
            ? className
            : "rounded-lg px-4 py-2 cursor-pointer font-medium bg-gray-200 dark:bg-zinc-800 hover:bg-indigo-700 dark:hover:bg-indigo-900 hover:text-white transition-colors"
        }
      >
        {children}
      </button>
    );
  }

  if (active) {
    return (
      <button
        className={
          className
            ? className
            : "rounded-lg px-4 py-2 cursor-pointer font-medium bg-indigo-600 dark:bg-indigo-800 hover:bg-indigo-700 dark:hover:bg-indigo-900 text-white transition-colors"
        }
      >
        {children}
      </button>
    );
  }

  return (
    <button
      className={
        className
          ? className
          : "rounded-lg px-4 py-2 cursor-pointer font-medium bg-gray-200 dark:bg-zinc-800 hover:bg-indigo-700 dark:hover:bg-indigo-900 hover:text-white transition-colors"
      }
    >
      {children}
    </button>
  );
}
