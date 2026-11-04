const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export const config = {
  apiUrl,
  sheetUrl: process.env.NEXT_PUBLIC_SHEET_URL ?? "",
  demoVideoUrl: process.env.NEXT_PUBLIC_DEMO_VIDEO_URL ?? "",
  repoUrl: process.env.NEXT_PUBLIC_REPO_URL ?? "",
  /** Empty API URL, or an explicit flag, runs the app against the in-browser mock backend. */
  useMock: process.env.NEXT_PUBLIC_USE_MOCK === "1" || apiUrl === "",
  /** Below this, a result needs a human. Must match the backend's threshold. */
  confidenceThreshold: 0.85,
  // shortcut: limits mirrored from the backend for instant feedback; backend stays the authority.
  maxUploadBytes: 5 * 1024 * 1024,
  retentionHours: 24,
  eval: {
    // shortcut: unset until the evaluation set runs; the About page renders "Not published yet".
    setSize: null as number | null,
    fieldAccuracy: null as number | null,
    autoApprovedShare: null as number | null,
  },
};
