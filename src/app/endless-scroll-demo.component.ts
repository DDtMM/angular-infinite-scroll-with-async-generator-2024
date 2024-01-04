import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AfterViewInitDirective } from './after-view-init.directive';
import { lazyLoadedListSignal } from './lazy-loaded-list-signal';
import { DataService } from './data.service';
import { pagedDataToGenerator } from './paged-data-to-generator';

@Component({
  selector: 'app-endless-scroll-demo',
  standalone: true,
  imports: [AfterViewInitDirective, CommonModule],
  template: `
<div class="text-3xl uppercase text-purple-600 p-6">Art Catalog</div>
<div class="infinite-scroll-host">
  <div class="items">
    @for(x of items().value; track $index) {
      <div class="item">
        @defer (on viewport) {
          <img class="rounded-md h-[200px] w-[200px] shadow-lg" [src]="x.imgUrl" (afterViewInit)="$last && items.load()" />
          <div class="text-lg text-center">{{x.name}}</div>
          <div class="text-lg text-center">{{x.price | currency : 'USD'}}</div>
        }
        @placeholder {
          <div class="rounded-md h-[200px] w-[200px] bg-slate-500 shadow-lg"></div>
        }
      </div>
    }
  </div>
  @if (items().loading) {
    <div class="loading-outer"><span class="loading-inner"></span></div>
  }
</div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EndlessScrollDemoComponent {
  private readonly dataSvc = inject(DataService);
  private readonly itemsGenerator = pagedDataToGenerator((pageIndex) => this.dataSvc.getInventoryFromPromise(pageIndex, 36));
  items = lazyLoadedListSignal(this.itemsGenerator, { defaultBatchSize: 24 });

  //items = lazyLoadedListSignal(this.dataSvc.getInventoryFromArray(0, 300), { defaultBatchSize: 12 });
}

