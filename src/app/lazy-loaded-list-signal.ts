import { Signal, WritableSignal, computed, signal, untracked } from '@angular/core';



export function lazyLoadedListSignal<T>(
  generator: AsyncIterator<T> | Iterator<T>,
  options?: LazyLoadedListSignalOptions
): LazyLoadedListSignal<T> {
  const defaultSize = options?.defaultBatchSize || 1;
  const state = signal<InternalState<T>>({ kind: 'value', value: [] });

  loadItems(defaultSize); // set initial items

  const output = computed<LazyLoadedListState<T>>(() => {
    const { error, kind, value } = state();
    if (kind === 'error') {
      throw new Error('Unable to retrieve data', { cause: error });
    }
    return { done: kind === 'done', loading: kind === 'loading', value };
  }) as LazyLoadedListSignal<T>;

  output.load = (batchSize?: number) => loadItems(batchSize || defaultSize);
  return output;

  /* loads the next batch of items. */
  async function loadItems(count: number): Promise<void> {
    const { kind: currentKind, value: currentValue } = untracked(state);
    if (currentKind !== 'value') {
      return; // only go forward if in "value" state.
    }
    state.update((s) => ({ ...s, kind: 'loading' }));
    const nextValue = [...currentValue];
    try {
      for (let i = 0; i < count; i++) {
        const item = await generator.next();
        if (item.done) {
          state.update((s) => ({ ...s, kind: 'done', value: nextValue }));
          break;
        }
        nextValue.push(item.value);
      }
      state.update((s) => ({ ...s, kind: 'value', value: nextValue }));
    } catch (error) {
      state.update((s) => ({ ...s, error, kind: 'error', value: nextValue }));
    }
  }
}

type InternalStateKind = 'done' | 'error' | 'loading' | 'value';
interface InternalState<T> {
  error?: unknown;
  kind: InternalStateKind;
  value: T[];
}
export interface LazyLoadedListState<T> {
  done: boolean;
  loading: boolean;
  value: T[];
}
export interface LazyLoadedListSignalOptions {
  /** Determines how many items should be loaded at once if no batch size is given when calling next. */
  defaultBatchSize?: number;
}
export type LazyLoadedListSignal<T> = Signal<LazyLoadedListState<T>> & {
  /** Loads the next batch of items.  If no size is given then defaultBatchSize */
  load(batchSize?: number): void;
};
