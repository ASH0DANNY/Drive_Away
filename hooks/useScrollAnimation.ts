import { useEffect, useRef, RefObject } from "react";

interface ScrollAnimationOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;

  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (triggerOnce && hasAnimatedRef.current) return;

            entry.target.classList.add("animate-in");
            hasAnimatedRef.current = true;

            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else {
            if (!triggerOnce) {
              entry.target.classList.remove("animate-in");
              hasAnimatedRef.current = false;
            }
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return elementRef;
}

// Hook for multiple animations on scroll
export function useScrollAnimations() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px -100px",
      }
    );

    const animatedElements = document.querySelectorAll("[data-animate]");
    animatedElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      animatedElements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, []);
}
