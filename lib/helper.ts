export function toSnakeCase(str: string): string {
  if (str) {
    return str
      .toLowerCase()
      .split(" ")
      .join("-")
      .replace(/[^a-z0-9\-]/gi, "");
  }
  return "";
}
