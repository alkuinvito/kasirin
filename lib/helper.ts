export function toSnakeCase(str: string): string {
  if (str) {
    return str.toLowerCase().split(" ").join("-");
  }
  return "";
}
