export type TPropertyFilters = {
  searchTerm?: string;
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  bedRooms?: string;
  status?: "AVAILABLE" | "RENTED" | "UNAVAILABLE";
  categoryId?: string;
};

const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Partial<T> => {
  const finalObj: Partial<T> = {};
  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }
  return finalObj;
};

export default pick;
