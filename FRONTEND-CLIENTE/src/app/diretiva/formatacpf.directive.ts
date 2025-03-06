import { Directive,HostListener,ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appFormatacpf]',
  standalone: true
})
export class FormatacpfDirective {

  constructor(private el: ElementRef) {    
  }
  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const input = this.el.nativeElement;
    let value = input.value;

    // Remove qualquer caractere que não seja número
    value = value.replace(/\D/g, '');
    // Aplica a máscara (exemplo para CPF)
    value = value.replace(/^(\d{3})(\d)/, '$1.$2');
    value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    
    input.value = value;
    
  } 

}

