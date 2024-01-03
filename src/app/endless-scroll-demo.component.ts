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
<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center content-center place-items-center gap-5 mb-5">
  @for(x of items().value; track $index) {
    <div class="border-4 p-3 border-primary rounded-md bg-primary text-primary-content shadow-lg">
      <div>
        @defer (on viewport) {
          <img class="rounded-md h-[200px] w-[200px] shadow-lg" [src]="x.imgUrl" (afterViewInit)="$last && items.load()" />
          <div class="text-lg text-center">{{x.name}}</div>
          <div class="text-lg text-center">{{x.price | currency : 'USD'}}</div>
        }
        @placeholder {
          <div class="rounded-md h-[200px] w-[200px] bg-slate-500 shadow-lg"></div>
        }
      </div>
    </div>
  }
</div>
@if (items().loading) {
  <div class="text-center p-3">
    <span class="loading loading-dots loading-lg"></span>
  </div>
}
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EndlessScrollDemoComponent {
  private readonly dataSvc = inject(DataService);
  private readonly itemsGenerator = pagedDataToGenerator((pageIndex) => this.dataSvc.getInventoryFromObservable(pageIndex, 36));
  items = lazyLoadedListSignal(this.itemsGenerator, { defaultBatchSize: 24 });
  //items = lazyLoadedListSignal(this.dataSvc.getInventoryFromArray(0, 300)[Symbol.iterator](), { defaultBatchSize: 12 });
}

