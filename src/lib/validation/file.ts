import { z } from "zod";
import { config } from "@/lib/config";

const accepted = ["image/jpeg", "image/png", "application/pdf"];

export const fileSchema = z
  .instanceof(File, { message: "Choose a file first." })
  .refine((file) => file.size > 0, { message: "That file is empty." })
  .refine((file) => accepted.includes(file.type), {
    message: "That file type is not supported. Use a JPG, PNG, or PDF.",
  })
  .refine((file) => file.size <= config.maxUploadBytes, {
    message: "That file is larger than 5 MB. Choose a smaller file or take a new photo.",
  });

/** Returns the first problem in plain language, or null when the file is fine (FR-005). */
export function validateFile(file: File): string | null {
  const result = fileSchema.safeParse(file);
  return result.success ? null : (result.error.issues[0]?.message ?? "That file cannot be used.");
}

// shortcut: PDF page count is enforced by the backend (first page only); the client checks type and size.
