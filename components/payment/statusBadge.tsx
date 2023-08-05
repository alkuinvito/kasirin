import { Status } from "@/lib/schema";

export default function StatusBadge({
  status = Status.Enum.pending,
}: {
  status?: Status;
}) {
  switch (status) {
    case Status.Enum.done:
      return (
        <span className="py-1 px-3 h-min w-min rounded-full text-sm font-medium text-white bg-green-600">
          {status}
        </span>
      );
    case Status.Enum.pending:
      return (
        <span className="py-1 px-3 h-min w-min rounded-full text-sm font-medium text-white bg-blue-400 dark:bg-blue-600/80">
          {status}
        </span>
      );
    case Status.Enum.expired:
      return (
        <span className="py-1 px-3 h-min w-min rounded-full text-sm font-medium text-white bg-gray-400 dark:bg-zinc-600">
          {status}
        </span>
      );
  }
}
