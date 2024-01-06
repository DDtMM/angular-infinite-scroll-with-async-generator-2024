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


/** In FireFox stream is already an AsyncIterable, but we need this for others. */
export async function *streamGenerator<T, U extends Iterable<T>>(s: ReadableStream<U>) {
  const reader = s.getReader();
  let res: ReadableStreamReadResult<U>;
  while (!(res = await reader.read()).done) {
    yield* res.value;
  }
}
