"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin, requireStudent } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { complaintSchema, statusUpdateSchema } from "@/lib/validation";
import type { FormState } from "@/lib/form-state";

const text = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "");

// Student: submit a new complaint.
export async function submitComplaint(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireStudent();

  const raw = {
    title: text(formData, "title"),
    category: text(formData, "category"),
    description: text(formData, "description"),
  };

  const parsed = complaintSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors, values: raw };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("complaints")
    .insert({ student_id: user.id, ...parsed.data });

  if (error) {
    return {
      error: "We couldn't submit your complaint. Please try again.",
      values: raw,
    };
  }

  redirect("/complaints?submitted=1");
}

// Admin: change a complaint's status.
export async function updateComplaintStatus(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const parsed = statusUpdateSchema.safeParse({
    complaintId: text(formData, "complaintId"),
    status: text(formData, "status"),
    adminNote: text(formData, "adminNote"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("complaints")
    .update({
      status: parsed.data.status,
      admin_note: parsed.data.adminNote || null,
    })
    .eq("id", parsed.data.complaintId)
    .select("id")
    .single();

  if (error || !data) {
    return { error: "Couldn't update the status. Please try again." };
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/complaints");
  return { success: "Saved." };
}
