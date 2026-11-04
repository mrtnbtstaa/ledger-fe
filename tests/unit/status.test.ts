import { describe, expect, it } from "vitest";
import { statusAnnouncement } from "@/lib/status";

describe("statusAnnouncement", () => {
  it("names the pipeline step while processing", () => {
    expect(statusAnnouncement({ status: "processing", stage: "extracting" })).toBe("Processing: Extracting.");
    expect(statusAnnouncement({ status: "processing" })).toBe("Processing: Uploading.");
  });

  it("names the outcome once the receipt is final", () => {
    expect(statusAnnouncement({ status: "needs_review" })).toBe("Status: Needs review.");
    expect(statusAnnouncement({ status: "auto_approved" })).toBe("Status: Auto-approved.");
  });
});
