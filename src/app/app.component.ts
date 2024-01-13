import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ArtStoreDemoComponent } from './demos/art-store-demo.component';
import { CsvReaderDemoComponent } from './demos/text-lines-demo.component';
import { FileReaderDemoComponent } from './demos/file-reader-demo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FileReaderDemoComponent, ArtStoreDemoComponent, CsvReaderDemoComponent, FormsModule, RouterOutlet],
  template: `
<div class="h-full w-full flex flex-col">
  <div class="navbar bg-base-content flex flex-row w-100 overflow-hidden">
    <a class="text-xl btn btn-ghost text-base-100 font-semibold" routerLink="/">
      Infinite Scroll with Angular Deferrable View and AsyncGenerator
    </a>
  </div>
  <div class="p-3">
    <label class="text-lg mr-3" for="demoSelect">Demo</label>
    <select class="select select-bordered select-sm text-lg" [ngModel]="demo()" (ngModelChange)="demo.set($event)" id="demoSelect">
      <option value="art-store">Art Store</option>
      <option value="file-reader">Binary File Reader</option>
      <option value="text-lines">Text Lines</option>
    </select>
  </div>
  <div class="flex-grow-1 h-full overflow-auto">
    @switch (demo()) {
      @case ('art-store') { <app-art-store-demo /> }

      @case ('file-reader') { <app-file-reader-demo /> }
      @case ('text-lines') { <app-text-lines-demo /> }
    }
  </div>
</div>
  `,
  styles: [],
})
export class AppComponent {
  readonly demo = signal<'art-store' | 'file-reader' | 'text-lines'>('art-store');
}
