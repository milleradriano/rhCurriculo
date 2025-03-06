import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCombopreenchido]'
})
export class CombopreenchidoDirective {
  constructor(private el: ElementRef, private renderer: Renderer2, private control: NgControl) {}

  @HostListener('ngModelChange', ['$event'])
  onInputChange(value: any) {
    this.updateBackgroundColor(value);
  }

  @HostListener('blur')
  onBlur() {
    if (this.control.control) {
      this.updateBackgroundColor(this.control.control.value);
    }
  }

  private updateBackgroundColor(value: any) {
    if (value) {
      this.renderer.setStyle(this.el.nativeElement.querySelector('.p-dropdown-label'), 'background-color', 'red');
    } else {
      this.renderer.setStyle(this.el.nativeElement.querySelector('.p-dropdown-label'), 'background-color', 'blue');
    }
  }
}