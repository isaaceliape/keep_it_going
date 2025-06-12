import React from "react";

interface HamburgerMenuProps {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  menuRef: React.RefObject<HTMLDivElement>;
  handleImportSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  menuOpen,
  setMenuOpen,
  menuRef,
  handleImportSubmit,
}) => (
  <div className="fixed top-4 right-4 z-50">
    <button
      aria-label="Open menu"
      className="p-2 rounded-full bg-white shadow hover:bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
      onClick={() => setMenuOpen((open) => !open)}
    >
      <svg
        width="28"
        height="28"
        fill="none"
        viewBox="0 0 24 24"
        stroke="black"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
    {menuOpen && (
      <div
        ref={menuRef}
        className="absolute right-0 mt-2 w-64 bg-white rounded shadow-lg border border-gray-200 p-4 flex flex-col gap-4 z-50"
      >
        <button
          onClick={() => {
            const link = document.createElement("a");
            link.href = "/api/habits/export";
            link.download = "habits.sqlite";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setMenuOpen(false);
          }}
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors shadow border-0 focus:ring-2 focus:ring-green-400 cursor-pointer"
        >
          Export data
        </button>
        <form
          onSubmit={handleImportSubmit}
          className="flex flex-col items-start gap-2"
        >
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors shadow border-0 focus:ring-2 focus:ring-blue-400 cursor-pointer"
          >
            Import data
          </button>
          <input
            id="import-sqlite"
            type="file"
            accept=".sqlite"
            className="block text-sm text-gray-500 file:mr-2 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
            title="Select a .sqlite file to import"
            placeholder="Select a .sqlite file"
          />
        </form>
      </div>
    )}
  </div>
);

export default HamburgerMenu;
