export const buttonClass = (variant: "primary" | "secondary" | "ghost" = "primary") => {
  const base =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-4 text-[0.9375rem] font-semibold disabled:cursor-not-allowed disabled:opacity-50";
  const variants = {
    primary: "bg-accent text-surface hover:bg-accent-deep",
    secondary: "border border-line bg-surface text-ink hover:bg-surface-sunken",
    ghost: "text-accent hover:bg-accent-soft",
  };
  return `${base} ${variants[variant]}`;
};
