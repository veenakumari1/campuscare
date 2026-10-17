import type { CategoryValue, StatusValue } from "@/lib/constants";

export type Role = "student" | "admin";

export type CurrentUser = {
  id: string;
  email: string;
  fullName: string;
  role: Role;
};

export type Complaint = {
  id: string;
  title: string;
  category: CategoryValue;
  description: string;
  status: StatusValue;
  created_at: string;
  admin_note?: string | null;
};

// A complaint as the admin sees it, with the student's name attached.
export type AdminComplaint = Complaint & {
  profiles: { full_name: string; email: string | null } | null;
};
