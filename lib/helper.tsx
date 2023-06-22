import { Role } from "./schema";

export function toSnakeCase(str: string): string {
  if (str) {
    return str.toLowerCase().split(" ").join("-");
  }
  return "";
}

export function coloredRole(role: Role): JSX.Element {
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
