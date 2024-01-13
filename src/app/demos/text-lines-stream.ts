export class TextLinesStream implements GenericTransformStream {
  private onChunk: (data: string) => void = () => {};
  private partialData = '';

  readonly readable = new ReadableStream<string>({
    start: (controller) => this.onChunk = (chunk) => controller.enqueue(chunk)
  });
  readonly writable = new WritableStream<string>({
    write: (data) => {
      const rows = (this.partialData + data).split('\n');
      this.partialData = rows.pop() ?? ''; // the last row may not be complete
      rows.forEach(this.onChunk);
    }
  });
}
