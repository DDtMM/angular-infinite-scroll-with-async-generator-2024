import { ChangeDetectionStrategy, Component, Input, TemplateRef, inject } from '@angular/core';
import { AfterViewInitDirective } from './after-view-init.directive';
import { lazyLoadedListSignal } from './lazy-loaded-list-signal';
import { CommonModule } from '@angular/common';

export type ScrollDataSource<T> = Iterable<T> | Iterator<T> | AsyncIterable<T> | AsyncIterator<T>;

@Component({
  selector: 'app-infinite-scroll',
  standalone: true,
  imports: [AfterViewInitDirective, CommonModule],
  template: `
<div class="infinite-scroll-host">
  <div class="items">
    @for(x of items().value; track $index) {
      <div class="item">
        @defer (on viewport) {
          <ng-container
            [ngTemplateOutlet]="contentTemplate ?? null"
            [ngTemplateOutletContext]="{ $implicit: x }"
            (afterViewInit)="$last && items.load(this.batchSize)"/>
        }
        @placeholder {
          <div><ng-container [ngTemplateOutlet]="placeholderTemplate || null" /></div>
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
export class InfiniteScrollComponent<T> {
  /** Number of items loaded when the user reaches the end. */
  @Input() batchSize = 100;
  /** The template used to display content of each element. */
  @Input() contentTemplate?: TemplateRef<{ $implicit: T }>;

  @Input()
  set dataSource(value: ScrollDataSource<T> | null | undefined) {
    this.items.set(value ?? []);
    this.items.load(this.batchSize);
  }

  readonly items = lazyLoadedListSignal<T>([], { defaultBatchSize: 0 });
  /** The template used to display while the content template is loading. */
  @Input() placeholderTemplate?: TemplateRef<T>;
}
