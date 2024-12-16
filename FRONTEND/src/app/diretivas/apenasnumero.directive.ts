import { Directive, ElementRef,HostListener,Input } from '@angular/core';

@Directive({
  selector: '[appApenasNumero]',
  standalone: true
})
export class ApenasNumeroDirective {

  constructor(private el:ElementRef) { }
@HostListener('input',['$event'])
onInputChange(event:Event):void{
  const input = this.el.nativeElement;
  let value = input.value;
  value = value.replace(/\D/g,'');
  
  
  

    input.value = value
 
}

}
