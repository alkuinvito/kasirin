import { Role } from "@/lib/schema";

export default function ColoredRole({ role }: { role: Role }) {
  switch (role) {
    case Role.Enum.owner:
      return (
        <span className="px-2 py-1 text-sm font-semibold rounded-full bg-blue-300/50 dark:bg-blue-500/30 text-blue-600 dark:text-blue-400">
          {role}
        </span>
      );
    case Role.Enum.manager:
      return (
        <span className="px-2 py-1 text-sm font-semibold rounded-full bg-yellow-300/50 dark:bg-yellow-500/30 text-yellow-700 dark:text-yellow-400">
          {role}
        </span>
      );
    case Role.Enum.employee:
      return (
        <span className="px-2 py-1 text-sm font-semibold rounded-full bg-gray-300/50 dark:bg-gray-500/30 text-gray-600 dark:text-gray-400">
          {role}
        </span>
      );
  }
}
