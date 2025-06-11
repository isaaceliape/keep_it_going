"use client";

import { useState, useEffect } from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.body.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  return (
    <html lang="en">
      <body>
        <div
          className="dark-mode-toggle bottom-6 right-6 top-auto left-auto"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            top: "auto",
            left: "auto",
            zIndex: 1000,
            cursor: "pointer",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
          }}
          onClick={toggleDarkMode}
        >
          <div
            className={`dark-mode-circle${isDarkMode ? " light" : " dark"}`}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              border: isDarkMode ? "2px solid #fff" : "2px solid #232526",
              transition: "background 0.3s, border 0.3s",
            }}
          />
        </div>
        {children}
      </body>
    </html>
  );
}
