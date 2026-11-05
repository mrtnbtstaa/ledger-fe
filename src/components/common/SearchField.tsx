"use client";

const field = "min-h-11 rounded-sm border border-line bg-surface px-2 text-sm";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function SearchField({
  value,
  onChange,
  placeholder = "Vendor or file name",
  className = "w-56",
}: Props) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink-muted">
      Search
      <input
        type="search"
        maxLength={100}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`${field} ${className}`}
      />
    </label>
  );
}