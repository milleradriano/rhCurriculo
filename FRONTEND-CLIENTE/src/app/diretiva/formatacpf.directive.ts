/*************  ✨ Codeium Command 🌟  *************/
import { Directive,HostListener,ElementRef, Input, OnInit } from '@angular/core';
// import { Directive,HostListener,ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appFormatacpf]',
  standalone: true
})
export class FormatacpfDirective implements OnInit {

  @Input() appFormatacpf?: string;
// export class FormatacpfDirective {

  constructor(private el: ElementRef) {    
  }

  ngOnInit(): void {
    this.formatarCPF(this.appFormatacpf || '');
  }
  
  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    this.formatarCPF((event.target as HTMLInputElement).value);
  }
    // const input = this.el.nativeElement;
    // let value = input.value;

  private formatarCPF(value: string) {
    // Remove qualquer caractere que não seja número
    value = value.replace(/\D/g, '');

    // Aplica a máscara (exemplo para CPF)
    value = value.replace(/^(\d{3})(\d)/, '$1.$2');
    value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    
    this.el.nativeElement.value = value;
  }
  //   input.value = value;
    
  // } 

}
/******  b4f1fa55-7340-4d3e-a246-2b7ab6727313  *******/

