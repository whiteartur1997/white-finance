import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appTwoDigitDecimalDirective]'
})
export class TwoDigitDecimalDirectiveDirective {
  private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  // here we injecting directive host element itself to get access to it
  constructor(private el: ElementRef) {}

  // adding here this $event allows access event object in the handler function
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    console.log("this.el.nativeElement", this.el.nativeElement)
    console.log("position", position)
    console.log(current.slice(0, position))
    console.log(current.slice(position))
    const next: string = [current.slice(0, position), event.key == '.' || event.key == ',' ? '.' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
