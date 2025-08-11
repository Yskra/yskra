import type { KeyboardMap } from './Public';
import type { Direction, KeyboardClick } from './Public.d';
import { onKeyDown } from '@vueuse/core';


export function setupEventHandlers(keyboardMap: KeyboardMap, callback: (d: Direction | typeof KeyboardClick, event: KeyboardEvent) => void): () => void {
  const key2direction = createReverseMap(keyboardMap);

  return onKeyDown(Object.keys(key2direction), (event) => {
    event.preventDefault();
    callback(key2direction[event.key], event);
  });
}

function createReverseMap(map: KeyboardMap): Record<string, keyof KeyboardMap> {
  return Object.fromEntries(
    Object.entries(map)
      .filter(([, v]) => v)
      .flatMap(([direction, keys]) => []
        .concat(keys)
        .map((key) => [key, direction as keyof KeyboardMap]),
      ),
  );
}

