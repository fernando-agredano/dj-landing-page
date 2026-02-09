export function scrollToElement(
  elementId: string,
  options?: {
    offset?: number;
    duration?: number;
  }
) {
  if (typeof window === "undefined") return;

  const el = document.getElementById(elementId);
  if (!el) return;

  const offset = options?.offset ?? 0;
  const duration = options?.duration ?? 900;

  const startY = window.scrollY;
  const targetY =
    el.getBoundingClientRect().top + window.scrollY - offset;

  const distance = targetY - startY;
  const startTime = performance.now();

  const easeInOut = (t: number) =>
    t < 0.5
      ? 2 * t * t
      : 1 - Math.pow(-2 * t + 2, 2) / 2;

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOut(progress);

    window.scrollTo(0, startY + distance * eased);

    if (elapsed < duration) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}
