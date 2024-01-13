import { Observable, firstValueFrom, isObservable } from 'rxjs';

/**
 * Takes a paged function that returns a single emission observable or promise and converts that to an AsyncGenerator
 * that yields each value individually.
 */
export async function* pagedDataToGenerator<T>(
  pageFn: (pageIndex: number) => Observable<T[]> | Promise<T[]>
): AsyncGenerator<Awaited<T>, void, undefined> {
  let currentPage = 0;
  let data: T[];
  do {
    const deferred = pageFn(currentPage);
    data = await (isObservable(deferred) ? firstValueFrom(deferred) : deferred);
    yield* data;
    currentPage++;
  } while (data.length > 0);
}
/** Returns an iterator for a stream. */
export async function *streamToGenerator<T>(s: ReadableStream<T>): AsyncGenerator<T, void, unknown> {
  const reader = s.getReader();
  let res: ReadableStreamReadResult<T>;
  while (!(res = await reader.read()).done) {
    yield res.value;
  }
}

/** Returns an iterator of elements of a stream's elements. */
export async function *streamDataGenerator<T, U extends Iterable<T>>(stream: ReadableStream<U>)
  : AsyncGenerator<Awaited<T>, void, undefined> {
  for await (const chunk of streamToGenerator(stream)) {
    yield* chunk;
  }
}

export function *createMappedGenerator<T, U>(s: Iterable<T>, mapFn: (input: T) => U): Generator<U, void, unknown> {
  for (let elem of s) {
    yield mapFn(elem);
  }
}
