import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "@/components/common/Pagination";

describe("Pagination", () => {
  it("moves by one page and stops at the edges", async () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Pagination total={25} limit={10} offset={0} onChange={onChange} />,
    );

    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(onChange).toHaveBeenCalledWith(10);

    rerender(<Pagination total={25} limit={10} offset={20} onChange={onChange} />);
    expect(screen.getByText("Page 3 of 3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("hides when everything fits", () => {
    const { container } = render(<Pagination total={3} limit={10} offset={0} onChange={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });
});
