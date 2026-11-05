export const AboutIntro = () => {
  return (
    <>
      <p className="mt-4 text-ink-muted">
        Receipts arrive as photos or PDFs, usually blurry, folded, or in a language the accounting software does not
        parse. Extracting the numbers is the easy half. The hard half is knowing when the numbers are wrong.
      </p>
      <p className="mt-3 text-ink-muted">
        So every result is shown with its own audit trail: the fields the model returned, the arithmetic rules run
        against them, a confidence value, and a decision. Anything that does not hold up waits for a person instead of
        being passed downstream.
      </p>
    </>
  );
}