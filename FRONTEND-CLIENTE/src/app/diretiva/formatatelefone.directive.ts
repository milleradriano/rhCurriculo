import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appFormatatelefone]',
  standalone: true,
})
export class FormatatelefoneDirective {
  constructor(private el: ElementRef) {}
  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const input = this.el.nativeElement;
    let value = input.value;
    value = value.replace(/\D/g, '');

    value = value.replace(/^(\d{2})(\d)/g, '($1)$2');
    value = value.replace(/(\d{5})(\d)/g, '$1-$2');

    input.value = value;
  }
}
