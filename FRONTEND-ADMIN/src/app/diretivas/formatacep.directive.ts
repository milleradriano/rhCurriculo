import { Directive, ElementRef, HostListener,Input } from '@angular/core';

@Directive({
  selector: '[appFormatacep]',
  standalone: true
})
export class FormatacepDirective {

  constructor(private el:ElementRef) { }
@HostListener('input',['$event'])
onInputChange(event:Event):void{
  const input = this.el.nativeElement;
  let value = input.value;
  value = value.replace(/\D/g, '');
  value = value.replace(/^(\d{5})(\d)/, '$1-$2');
  input.value = value;
}
}
