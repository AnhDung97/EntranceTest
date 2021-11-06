import { Directive, ElementRef, EventEmitter, Host, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appScreen]'
})
export class ScreenDirective {

  @Output() scrollLeft = new EventEmitter<number>()

  constructor(private readonly el: ElementRef) { }

  @HostListener('scroll', ['$event']) onScroll($event) {
    this.scrollLeft.emit($event.target.scrollLeft);
  }
}
