import { config } from "@/lib/config";

const accepted = ["image/jpeg", "image/png", "application/pdf"];

/** Returns the first problem in plain language, or null when the file is fine (FR-005). */
export function validateFile(file: File): string | null {
  if (file.size === 0) return "That file is empty.";
  if (!accepted.includes(file.type)) return "That file type is not supported. Use a JPG, PNG, or PDF.";
  if (file.size > config.maxUploadBytes) {
    return "That file is larger than 5 MB. Choose a smaller file or take a new photo.";
  }
  return null;
}

// shortcut: PDF page count is enforced by the backend (first page only); the client checks type and size.
