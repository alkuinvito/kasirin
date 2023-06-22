import { Role } from "@/lib/schema";

export default function ColoredRole({ role }: { role: Role }) {
  switch (role) {
    case Role.Enum.owner:
      return (
        <span className="p-2 text-sm font-semibold rounded-lg bg-blue-500 text-white">
          {role}
        </span>
      );
    case Role.Enum.manager:
      return (
        <span className="p-2 text-sm font-semibold rounded-lg bg-yellow-500 text-white ">
          {role}
        </span>
      );
    case Role.Enum.employee:
      return (
        <span className="p-2 text-sm font-semibold rounded-lg bg-gray-500 text-white">
          {role}
        </span>
      );
  }
}
