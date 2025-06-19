import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import HamburgerMenu from "./HamburgerMenu";

const setMenuOpen = jest.fn();
const menuRef = {
  current: document.createElement("div"),
} as React.RefObject<HTMLDivElement>;
// Fix menuRef type for compatibility with HamburgerMenu
const handleImportSubmit = jest.fn((e: React.FormEvent<HTMLFormElement>) =>
  e.preventDefault()
);

describe("HamburgerMenu", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the menu button", () => {
    render(
      <HamburgerMenu
        menuOpen={false}
        setMenuOpen={setMenuOpen}
        menuRef={menuRef}
        handleImportSubmit={handleImportSubmit}
      />
    );
    expect(screen.getByLabelText(/open menu/i)).toBeInTheDocument();
  });

  it("calls setMenuOpen when menu button is clicked", () => {
    render(
      <HamburgerMenu
        menuOpen={false}
        setMenuOpen={setMenuOpen}
        menuRef={menuRef}
        handleImportSubmit={handleImportSubmit}
      />
    );
    fireEvent.click(screen.getByLabelText(/open menu/i));
    expect(setMenuOpen).toHaveBeenCalled();
  });

  it("shows menu when menuOpen is true", () => {
    render(
      <HamburgerMenu
        menuOpen={true}
        setMenuOpen={setMenuOpen}
        menuRef={menuRef}
        handleImportSubmit={handleImportSubmit}
      />
    );
    expect(screen.getByText(/export data/i)).toBeInTheDocument();
    expect(screen.getByText(/import data/i)).toBeInTheDocument();
  });

  it("calls handleImportSubmit on import form submit", () => {
    render(
      <HamburgerMenu
        menuOpen={true}
        setMenuOpen={setMenuOpen}
        menuRef={menuRef}
        handleImportSubmit={handleImportSubmit}
      />
    );
    const form = screen.getByTestId("import-form");
    fireEvent.submit(form);
    expect(handleImportSubmit).toHaveBeenCalled();
  });
});
