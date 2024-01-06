import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AfterViewInitDirective } from './after-view-init.directive';
import { streamGenerator } from './generator-utilities';
import { lazyLoadedListSignal } from './lazy-loaded-list-signal';

@Component({
  selector: 'app-file-reader-demo',
  standalone: true,
  imports: [AfterViewInitDirective, CommonModule],
  template: `
<div class="text-3xl uppercase text-purple-600 p-6">
  <input type="file" (change)="onChange($event)">
</div>
<div class="file-contents infinite-scroll-host">
  <div class="items">
    @for(x of items().value; track $index) {
      <div class="item">
        @defer (on viewport) {
          <div (afterViewInit)="$last && items.load()">{{x.toString(16)}}</div>
        }
        @placeholder {
          <div>?</div>
        }
      </div>
    }
  </div>
  @if (items().loading) {
    <div class="loading-outer"><span class="loading-inner"></span></div>
  }
</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileReaderDemoComponent {
  items = lazyLoadedListSignal([] as any[], { defaultBatchSize: 24 });

  onChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.items = lazyLoadedListSignal(streamGenerator(file.stream()), { defaultBatchSize: 1024 });
    }
  }
}

