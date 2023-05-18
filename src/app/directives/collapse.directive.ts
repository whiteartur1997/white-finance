import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appCollapse]',
})
export class CollapseDirective {

  constructor(private el: ElementRef) { }

  @HostListener("click", ["$event"])
  onClick(event: MouseEvent) {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }
    if(event.target?.dataset?.['collapsetrigger']) {
      this.el.nativeElement.classList.toggle("collapse")
    }
  }

}
