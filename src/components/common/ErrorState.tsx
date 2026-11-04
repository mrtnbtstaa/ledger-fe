import { buttonClass } from "@/components/ui/button";

type ErrorStateProps = {
  title: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
};

/** Says what happened, what to do next, and offers one action (FR-023, FR-024). */
export function ErrorState({ title, message, onRetry, retryLabel = "Try again" }: ErrorStateProps) {
  return (
    <div role="alert" className="rounded-sm border border-danger/40 bg-danger-soft px-4 py-3 text-sm text-danger">
      <p className="font-semibold">{title}</p>
      <p className="mt-1">{message}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className={`${buttonClass("secondary")} mt-3 border-danger/60 text-danger`}>
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}
