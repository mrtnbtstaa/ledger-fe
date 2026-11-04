import { normalizeError, transportError, type ApiFailure } from "./errors";

const isApiFailure = (value: unknown): value is ApiFailure =>
  typeof value === "object" && value !== null && "code" in value && "message" in value;

type Result<T> = { data?: T; error?: unknown; response: Response };

/** Runs one openapi-fetch call and turns every failure into a message the UI can show (FR-024). */
export async function call<T>(run: () => Promise<Result<T>>): Promise<T> {
  try {
    const { data, error, response } = await run();
    if (error !== undefined || !response.ok) throw normalizeError(response.status, error ?? data);
    return data as T;
  } catch (thrown) {
    if (isApiFailure(thrown)) throw thrown;
    throw transportError(thrown);
  }
}
