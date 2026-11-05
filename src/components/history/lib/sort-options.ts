export const sortOptions = {
  "date-desc": { label: "Newest first", sort: "date", order: "desc" },
  "date-asc": { label: "Oldest first", sort: "date", order: "asc" },
  "total-desc": { label: "Highest total", sort: "total", order: "desc" },
  "total-asc": { label: "Lowest total", sort: "total", order: "asc" },
} as const;

export type SortKey = keyof typeof sortOptions;
export type SortOption = (typeof sortOptions)[SortKey];