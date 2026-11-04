import { describe, expect, it } from "vitest";
import { validateFile } from "@/lib/validation/file";

const file = (name: string, type: string, bytes: number) =>
  new File([new Uint8Array(bytes)], name, { type });

describe("validateFile", () => {
  it("accepts the three supported types", () => {
    expect(validateFile(file("a.jpg", "image/jpeg", 1024))).toBeNull();
    expect(validateFile(file("a.png", "image/png", 1024))).toBeNull();
    expect(validateFile(file("a.pdf", "application/pdf", 1024))).toBeNull();
  });

  it("rejects an unsupported type before anything is uploaded", () => {
    expect(validateFile(file("notes.txt", "text/plain", 1024))).toContain("not supported");
  });

  it("rejects a file over the size limit", () => {
    expect(validateFile(file("big.jpg", "image/jpeg", 6 * 1024 * 1024))).toContain("5 MB");
  });

  it("rejects an empty file", () => {
    expect(validateFile(file("empty.pdf", "application/pdf", 0))).toContain("empty");
  });
});
