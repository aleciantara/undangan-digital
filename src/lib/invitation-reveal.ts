/** PowerPoint-style entrance: trigger once on scroll, play timed animation, stay visible. */
export const INVITATION_PRESENT = {
  threshold: 0.15,
  rootMargin: "0px 0px -10% 0px",
  /** Maps template stagger units (e.g. i * 80) to ms between "After Previous" steps */
  staggerScale: 5.5,
} as const;

export function scrollRootFor(el: HTMLElement, scrollRef: HTMLElement | null): Element | null {
  if (scrollRef) {
    const style = getComputedStyle(scrollRef);
    const scrollable =
      (style.overflowY === "auto" || style.overflowY === "scroll") &&
      scrollRef.scrollHeight > scrollRef.clientHeight;
    if (scrollable) return scrollRef;
  }

  let parent = el.parentElement;
  while (parent) {
    const style = getComputedStyle(parent);
    if (
      (style.overflowY === "auto" || style.overflowY === "scroll") &&
      parent.scrollHeight > parent.clientHeight
    ) {
      return parent;
    }
    parent = parent.parentElement;
  }

  return null;
}

export function presentationDelay(staggerMs: number): number {
  return Math.round(staggerMs * INVITATION_PRESENT.staggerScale);
}
