import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InfiniteScrollComponent } from '../infinite-scroll/infinite-scroll.component';
import { streamToGenerator } from './generator-utilities';
import { TextLinesStream } from './text-lines-stream';

@Component({
  selector: 'app-text-lines-demo',
  standalone: true,
  imports: [InfiniteScrollComponent],
  template: `
<app-infinite-scroll class="file-lines"  [batchSize]="16" [contentTemplate]="content"
  [dataSource]="csvContents()" [placeholderTemplate]="placeholder">
  <ng-template #content let-x>{{x}}</ng-template>
  <ng-template #placeholder>?</ng-template>
</app-infinite-scroll>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CsvReaderDemoComponent {
  csvContents = signal<AsyncIterator<string> | Iterable<string> | undefined>(undefined)
  constructor() {
    this.loadFile('assets/jeopardy.csv');
  }

  async loadFile(filePath: string): Promise<void> {
    const response = await fetch(filePath);
    const textFile = response.body?.pipeThrough(new TextDecoderStream()).pipeThrough(new TextLinesStream());
    this.csvContents.set(textFile ? streamToGenerator(textFile) : []);
  }
}

