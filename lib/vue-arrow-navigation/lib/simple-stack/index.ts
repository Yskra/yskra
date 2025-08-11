// noinspection JSUnusedGlobalSymbols

export class SimpleStack<T = any> {
  #items: T[] = [];

  push(element: T): void {
    this.#items.push(element);
  }

  pop(): T | null {
    return this.#isEmpty ? null : this.#items.pop()!;
  }

  peek(): T | null {
    return this.#isEmpty ? null : this.#items.at(-1)!;
  }

  get size(): number {
    return this.#items.length;
  }

  clear(): void {
    this.#items = [];
  }

  filter(predicate: (item: T) => boolean): void {
    this.#items = this.#items.filter(predicate);
  }

  * [Symbol.iterator](): Iterator<T> {
    for (let i = this.#items.length - 1; i >= 0; i--) {
      yield this.#items[i];
    }
  }

  get #isEmpty(): boolean {
    return this.#items.length === 0;
  }
}
