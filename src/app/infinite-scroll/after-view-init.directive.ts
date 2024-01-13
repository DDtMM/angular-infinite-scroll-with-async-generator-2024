import { AfterViewInit, Directive, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[afterViewInit]',
  standalone: true
})
export class AfterViewInitDirective implements AfterViewInit {
  @Output('afterViewInit') callbackFn = new EventEmitter<void>();
  ngAfterViewInit(): void {
    this.callbackFn.emit();
    this.callbackFn.complete(); // Only need to emit once.
  }
}
