import { z } from "zod";
import { CATEGORY_VALUES, STATUS_VALUES } from "@/lib/constants";

// Validation rules. They run on the server, so they cannot be skipped.

const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Enter a valid email address."));

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password."),
});

export const signupSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(80, "Name must be 80 characters or fewer."),
  email,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be 72 characters or fewer."),
});

export const complaintSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters.")
    .max(120, "Title must be 120 characters or fewer."),
  category: z.enum(CATEGORY_VALUES, { error: "Choose a category." }),
  description: z
    .string()
    .trim()
    .min(20, "Please describe the problem in at least 20 characters.")
    .max(2000, "Description must be 2000 characters or fewer."),
});

export const statusUpdateSchema = z.object({
  complaintId: z.uuid("Invalid complaint."),
  status: z.enum(STATUS_VALUES, { error: "Choose a valid status." }),
  adminNote: z
    .string()
    .trim()
    .max(1000, "Reply must be 1000 characters or fewer."),
});
