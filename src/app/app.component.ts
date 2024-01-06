import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { InfiniteScrollDemoComponent } from './infinite-scroll-demo.component';
import { FileReaderDemoComponent } from './file-reader-demo.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FileReaderDemoComponent, InfiniteScrollDemoComponent, FormsModule, RouterOutlet],
  template: `
<div class="h-full w-full flex flex-col">
  <div class="navbar bg-base-content flex flex-row w-100">
    <a class="text-xl btn btn-ghost text-base-100 font-semibold" routerLink="/">
      Infinite Scroll with Angular Deferrable View and AsyncGenerator
    </a>
  </div>
  <div class="p-3">
    <label class="text-lg mr-3" for="demoSelect">Demo</label>
    <select  class="select select-bordered select-sm text-lg" [ngModel]="demo()" (ngModelChange)="demo.set($event)" id="demoSelect">
      <option value="art-store">Art Store</option>
      <option value="file-reader">File Reader</option>
    </select>
  </div>
  <div class="flex-grow-1 h-full overflow-auto">
    @switch (demo()) {
      @case ('art-store') { <app-infinite-scroll-demo /> }
      @case ('file-reader') { <app-file-reader-demo /> }
    }
  </div>
</div>
  `,
  styles: [],
})
export class AppComponent {
  readonly demo = signal<'art-store' | 'file-reader'>('art-store');
}
