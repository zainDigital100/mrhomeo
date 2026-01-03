import { useRef, useCallback, useEffect } from "react";

interface UseSmartScrollOptions {
  threshold?: number; // Pixels from bottom to consider "at bottom"
}

export function useSmartScroll<T extends HTMLElement = HTMLDivElement>(
  options: UseSmartScrollOptions = {}
) {
  const { threshold = 150 } = options;
  const containerRef = useRef<T>(null);
  const isNearBottomRef = useRef(true);
  const lastScrollTopRef = useRef(0);

  // Check if user is near bottom
  const checkIfNearBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return true;
    
    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    return distanceFromBottom <= threshold;
  }, [threshold]);

  // Smart scroll - only scrolls if user was near bottom
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const container = containerRef.current;
    if (!container) return;
    
    if (isNearBottomRef.current) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior,
      });
    }
  }, []);

  // Force scroll to bottom (e.g., after user sends message)
  const forceScrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const container = containerRef.current;
    if (!container) return;
    
    isNearBottomRef.current = true;
    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
  }, []);

  // Handle scroll events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScrollTop = container.scrollTop;
      const isScrollingUp = currentScrollTop < lastScrollTopRef.current;
      
      // If user scrolls up, they're intentionally looking at history
      if (isScrollingUp) {
        isNearBottomRef.current = false;
      } else {
        // If scrolling down, check if near bottom
        isNearBottomRef.current = checkIfNearBottom();
      }
      
      lastScrollTopRef.current = currentScrollTop;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [checkIfNearBottom]);

  return {
    containerRef,
    scrollToBottom,
    forceScrollToBottom,
    isNearBottom: () => isNearBottomRef.current,
  };
}
