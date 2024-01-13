import { ChangeDetectionStrategy, Component } from '@angular/core';
import { streamDataGenerator } from './generator-utilities';
import { InfiniteScrollComponent } from '../infinite-scroll/infinite-scroll.component';

@Component({
  selector: 'app-file-reader-demo',
  standalone: true,
  imports: [InfiniteScrollComponent],
  template: `
<div class="text-xl uppercase text-purple-600 p-6">
  <input type="file" (change)="onFileChange($event)">
</div>
<app-infinite-scroll class="file-contents"  [batchSize]="256" [contentTemplate]="content"
  [dataSource]="fileContents" [placeholderTemplate]="placeholder">
  <ng-template #content let-x>{{x.toString(16)}}</ng-template>
  <ng-template #placeholder>?</ng-template>
</app-infinite-scroll>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileReaderDemoComponent {
  fileContents?: AsyncGenerator<unknown>;

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.fileContents = (file) ? streamDataGenerator(file.stream()) : undefined;
  }
}

