import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { EndlessScrollDemoComponent } from './endless-scroll-demo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, EndlessScrollDemoComponent, RouterOutlet],
  template: `
<div class="h-full w-full flex flex-col">
  <div class="navbar bg-base-content flex flex-row w-100">
    <a class="text-xl btn btn-ghost text-base-100 font-semibold" routerLink="/">
      Infinite Scroll with Angular Deferrable View and AsyncGenerator
    </a>
  </div>
  <div class="flex-grow-1 h-full overflow-auto">
    <app-endless-scroll-demo />
  </div>
</div>
  `,
  styles: [],
})
export class AppComponent {

}
