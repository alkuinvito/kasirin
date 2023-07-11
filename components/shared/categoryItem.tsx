import { ReactNode } from "react";

export default function CategoryItem({
  children,
  onClick = () => {},
  active = false,
  className,
  ...props
}: {
  children?: ReactNode;
  onClick?: Function;
  active?: boolean;
  className?: string;
}) {
  if (active) {
    return (
      <button
        onClick={() => onClick()}
        className={
          className
            ? className
            : "min-w-[2rem] rounded-full px-4 py-2 cursor-pointer text-center font-medium whitespace-nowrap bg-indigo-600 dark:bg-indigo-800 hover:bg-indigo-700 dark:hover:bg-indigo-900 text-white transition-colors"
        }
        {...props}
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
          : "min-w-[2rem] rounded-full px-4 py-2 cursor-pointer text-center font-medium whitespace-nowrap bg-gray-200 dark:bg-zinc-800 hover:bg-indigo-700 dark:hover:bg-indigo-900 hover:text-white transition-colors"
      }
      {...props}
    >
      {children}
    </button>
  );
}
