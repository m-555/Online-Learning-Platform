import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Modal } from "./modal";

function Example({ onClose }: { onClose: () => void }) {
  return (
    <Modal open onClose={onClose} titleId="t">
      <h2 id="t">Welcome back</h2>
      <button>First</button>
      <button>Last</button>
    </Modal>
  );
}

describe("Modal", () => {
  it("exposes an accessible dialog labelled by its title", () => {
    render(<Example onClose={() => {}} />);
    const dialog = screen.getByRole("dialog", { name: "Welcome back" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("moves focus to the first focusable element on open", () => {
    render(<Example onClose={() => {}} />);
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
  });

  it("closes on Escape", () => {
    const onClose = vi.fn();
    render(<Example onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});
