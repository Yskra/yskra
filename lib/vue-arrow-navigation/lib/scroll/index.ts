import { Direction } from '../navigation';
import { findScrollContainer } from './scrollParent';

const VERTICAL_VIEWPORT_THRESHOLD = 0.5;

export function scrollTo({ target, rect, direction }: { target: Element; rect: DOMRectReadOnly; direction: Direction | null }) {
  const parent = findScrollContainer(target);

  // run always: restore, keyboard or autofocus
  if (parent) {
    verticalScrollSegment(rect.top + parent.scrollTop, parent);
  }

  // run only from keyboard
  if (direction === Direction.RIGHT || direction === Direction.LEFT) {
    horizontalScroll(target);
  }
}

function verticalScrollSegment(target: number, host: Element, threshold = VERTICAL_VIEWPORT_THRESHOLD) {
  const currentScrollY = host.scrollTop;
  const viewportHeight = window.innerHeight;
  const segments = getScrollVerticalSegments(host, threshold);
  const targetSegment = segments.find((segment) =>
    target < (segment + threshold * viewportHeight),
  );

  if (targetSegment !== undefined && Math.abs(currentScrollY - targetSegment) > 10 && host.scrollTo) {
    host.scrollTo({
      top: targetSegment,
      behavior: 'smooth',
    });
  }
}

function horizontalScroll(target: Element) {
  target.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
}

function getScrollVerticalSegments(host: Element = document.documentElement, threshold = VERTICAL_VIEWPORT_THRESHOLD) {
  const viewportHeight = window.innerHeight;
  const pageHeight = host.scrollHeight;
  const segmentStep = threshold * viewportHeight;
  const segments = [0];

  let currentPosition: number = segmentStep;

  while (currentPosition < pageHeight) {
    segments.push(Math.round(currentPosition));
    currentPosition += segmentStep;
  }

  if (segments[segments.length - 1] !== pageHeight) {
    segments.push(pageHeight);
  }

  return segments;
}
