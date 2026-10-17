export const CATEGORIES = [
  { value: "academic", label: "Academic" },
  { value: "hostel", label: "Hostel" },
  { value: "facilities", label: "Facilities & maintenance" },
  { value: "library", label: "Library" },
  { value: "transport", label: "Transport" },
  { value: "other", label: "Other" },
] as const;

export const STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
  { value: "rejected", label: "Rejected" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];
export type StatusValue = (typeof STATUSES)[number]["value"];

export const CATEGORY_VALUES = CATEGORIES.map((c) => c.value) as [
  CategoryValue,
  ...CategoryValue[],
];
export const STATUS_VALUES = STATUSES.map((s) => s.value) as [
  StatusValue,
  ...StatusValue[],
];

export function categoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function statusLabel(value: string) {
  return STATUSES.find((s) => s.value === value)?.label ?? value;
}
