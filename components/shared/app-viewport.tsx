"use client";

import {
  useEffect,
  useRef,
  type KeyboardEvent,
  type ReactNode,
  type WheelEvent,
} from "react";
import { usePathname } from "next/navigation";

function canNestedElementScroll(
  target: EventTarget | null,
  root: HTMLElement,
  deltaY: number,
) {
  let element = target instanceof Element ? target : null;

  while (element && element !== root) {
    const style = window.getComputedStyle(element);
    const canScroll = /(auto|scroll)/.test(style.overflowY);
    const hasScrollableContent =
      element.scrollHeight > element.clientHeight + 1;
    const hasRoom =
      deltaY < 0
        ? element.scrollTop > 0
        : element.scrollTop + element.clientHeight < element.scrollHeight - 1;

    if (canScroll && hasScrollableContent && hasRoom) return true;
    element = element.parentElement;
  }

  return false;
}

export function AppViewport({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const viewportRef = useRef<HTMLDivElement>(null);
  const wheelFallbackRef = useRef({
    frame: 0,
    startTop: 0,
    deltaY: 0,
  });

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    viewport.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  useEffect(() => {
    const wheelFallback = wheelFallbackRef.current;

    return () => {
      if (wheelFallback.frame) {
        window.cancelAnimationFrame(wheelFallback.frame);
      }
    };
  }, []);

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY))
      return;

    const viewport = event.currentTarget;
    if (canNestedElementScroll(event.target, viewport, event.deltaY)) return;

    const multiplier =
      event.deltaMode === 1
        ? 16
        : event.deltaMode === 2
          ? viewport.clientHeight
          : 1;
    const pending = wheelFallbackRef.current;

    if (!pending.frame) {
      pending.startTop = viewport.scrollTop;
      pending.deltaY = event.deltaY * multiplier;
      pending.frame = window.requestAnimationFrame(() => {
        if (Math.abs(viewport.scrollTop - pending.startTop) < 1) {
          viewport.scrollTop += pending.deltaY;
        }
        pending.frame = 0;
        pending.deltaY = 0;
      });
    } else {
      pending.deltaY += event.deltaY * multiplier;
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;

    const viewport = event.currentTarget;
    const page = Math.max(240, viewport.clientHeight * 0.85);
    const keyActions: Record<string, () => void> = {
      ArrowDown: () => {
        viewport.scrollTop += 48;
      },
      ArrowUp: () => {
        viewport.scrollTop -= 48;
      },
      PageDown: () => {
        viewport.scrollTop += page;
      },
      PageUp: () => {
        viewport.scrollTop -= page;
      },
      Home: () => {
        viewport.scrollTop = 0;
      },
      End: () => {
        viewport.scrollTop = viewport.scrollHeight;
      },
      " ": () => {
        viewport.scrollTop += event.shiftKey ? -page : page;
      },
    };
    const action = keyActions[event.key];

    if (action) {
      event.preventDefault();
      action();
    }
  };

  return (
    <div
      ref={viewportRef}
      id="app-viewport"
      className="app-viewport"
      data-scroll-root
      role="region"
      tabIndex={0}
      aria-label="Scrollable page content"
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}
