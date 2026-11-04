import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-[680px] px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl">That page does not exist</h1>
      <p className="mt-2 text-ink-muted">
        The link may be from an older version of the demo, or the receipt it pointed at was deleted.
      </p>
      <Link href="/" className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-accent underline">
        Back to processing
      </Link>
    </div>
  );
}
