import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appScreen]'
})
export class ScreenDirective {

  @Output() scrollLeft = new EventEmitter<number>()

  constructor() { }

  @HostListener('scroll', ['$event']) onScroll(event: Event) {
    this.scrollLeft.emit((<HTMLInputElement>event.target).scrollLeft);
  }
}
