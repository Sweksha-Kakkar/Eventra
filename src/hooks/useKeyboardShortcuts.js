import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const useKeyboardShortcuts = ({
  onOpenHelp,
  onCloseHelp,
  onOpenCreateEvent, // Naya function 'N' key ke liye
  onFocusSearch,     // Naya function '/' key ke liye
}) => {
  const navigate = useNavigate();
  const keyBuffer = useRef([]);

  useEffect(() => {
    const handler = (e) => {
      const active = document.activeElement;

      const isTyping =
        active &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName);

      // Agar user type kar raha hai toh shortcuts skip karo, BUT Escape ko allow karo close karne ke liye
      if (isTyping && e.key !== "Escape") return;

      // 1. Open Help Modal (Shift + ?)
      if (e.shiftKey && e.key === "?") {
        e.preventDefault();
        if (onOpenHelp) onOpenHelp();
        return;
      }

      // 2. Close Modal (Escape)
      if (e.key === "Escape") {
        e.preventDefault();
        if (onCloseHelp) onCloseHelp();
        keyBuffer.current = [];
        return;
      }

      // 3. Open Create Event Modal (Single key 'n' ya 'N')
      if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        if (onOpenCreateEvent) onOpenCreateEvent();
        return;
      }

      // 4. Focus Search Bar (Single key '/')
      if (e.key === "/") {
        e.preventDefault();
        if (onFocusSearch) onFocusSearch();
        return;
      }

      // Sequence combos (g + h, g + l, etc.)
      keyBuffer.current.push(e.key.toLowerCase());

      if (keyBuffer.current.length > 2) {
        keyBuffer.current.shift();
      }

      const combo = keyBuffer.current.join("");

      if (combo === "gh") {
        navigate("/");
        keyBuffer.current = [];
      }

      if (combo === "gl") {
        navigate("/login");
        keyBuffer.current = [];
      }

      if (combo === "gs") {
        navigate("/signup");
        keyBuffer.current = [];
      }
    };

    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [navigate, onOpenHelp, onCloseHelp, onOpenCreateEvent, onFocusSearch]);
};

export default useKeyboardShortcuts;