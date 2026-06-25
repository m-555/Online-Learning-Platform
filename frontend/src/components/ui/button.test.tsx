import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./button";

describe("Button", () => {
  it("renders its label and primary styles by default", () => {
    render(<Button>Book a class</Button>);
    const button = screen.getByRole("button", { name: "Book a class" });
    expect(button).toBeInTheDocument();
    expect(button.className).toContain("bg-primary");
  });

  it("applies the danger variant", () => {
    render(<Button variant="danger">Leave</Button>);
    expect(screen.getByRole("button", { name: "Leave" }).className).toContain("bg-danger");
  });

  it("calls onClick when pressed", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not fire when disabled", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Nope
      </Button>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Nope" }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
