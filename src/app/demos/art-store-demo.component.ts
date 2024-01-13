import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DataService } from './data.service';
import { createMappedGenerator, pagedDataToGenerator } from './generator-utilities';
import { InfiniteScrollComponent } from '../infinite-scroll/infinite-scroll.component';

@Component({
  selector: 'app-art-store-demo',
  standalone: true,
  imports: [CommonModule, InfiniteScrollComponent],
  template: `
<div class="text-3xl uppercase text-purple-600 p-6">
  Art Catalog
</div>
<app-infinite-scroll class="art-store" [batchSize]="32" [contentTemplate]="content" [dataSource]="itemsIterator"
  [placeholderTemplate]="placeholder">
  <ng-template #content let-x>
    <img class="rounded-md h-[200px] w-[200px] shadow-lg" [src]="x.imgUrl"/>
    <div class="text-lg text-center">{{x.name}}</div>
    <div class="text-lg text-center">{{x.price | currency : 'USD'}}</div>
  </ng-template>
  <ng-template #placeholder>
    <div class="rounded-md h-[200px] w-[200px] bg-slate-500 shadow-lg"></div>
  </ng-template>
</app-infinite-scroll>

  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtStoreDemoComponent {
  private readonly dataSvc = inject(DataService);
  readonly itemsIterator = pagedDataToGenerator((pageIndex) => this.dataSvc.getInventoryFromObservable(pageIndex, 100));
  //readonly itemsIterator = pagedDataToGenerator((pageIndex) => this.dataSvc.getInventoryFromPromise(pageIndex, 100));
  //readonly itemsIterator = createMappedGenerator(
  //  this.dataSvc.getInventoryFromArray(0, 1000).map(x => ({ someProperty: x })), x => x.someProperty);
}
