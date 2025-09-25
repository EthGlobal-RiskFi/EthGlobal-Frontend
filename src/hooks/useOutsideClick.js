// src/hooks/useOutsideClick.js
import { useEffect } from "react";

/**
 * Calls `onOutside` when a click or touch happens outside the `ref` element.
 * Also listens for Escape key and calls onEscape if provided.
 *
 * Usage:
 *   const ref = useRef(null);
 *   useOutsideClick(ref, { onOutside: () => setOpen(false), onEscape: () => setOpen(false) });
 */
export default function useOutsideClick(ref, { onOutside, onEscape } = {}) {
  useEffect(() => {
    if (!ref?.current) return;

    function onPointer(e) {
      const el = ref.current;
      if (!el) return;
      // if clicked element is not inside ref, call callback
      if (!el.contains(e.target)) onOutside?.(e);
    }

    function onKey(e) {
      if (e.key === "Escape") onEscape?.(e);
    }

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("touchstart", onPointer);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [ref, onOutside, onEscape]);
}
