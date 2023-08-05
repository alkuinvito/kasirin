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

export function calculateSkip(current: number) {
  return current * 10;
}

export function calculateTotalPage(itemsLen: number) {
  return Math.ceil(itemsLen / 10);
}
