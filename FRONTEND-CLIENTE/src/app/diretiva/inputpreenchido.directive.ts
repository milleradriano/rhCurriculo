import { Directive, ElementRef, Renderer2, HostListener, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appInputpreenchido]',
  standalone: true
})
export class InputpreenchidoDirective implements AfterViewInit {

  private inputElement: HTMLInputElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    // Espera o input ser renderizado dentro do p-password
    setTimeout(() => {
      this.findInputElement();
      this.changeColor();
    }, 0);
  }

  @HostListener('input') onInputChange() {
    this.changeColor();
  }

  private findInputElement() {
    // Para um input normal
    if (this.el.nativeElement.tagName === 'INPUT') {
      this.inputElement = this.el.nativeElement;
    } 
    // Para um p-password (PrimeNG)
    else {
      this.inputElement = this.el.nativeElement.querySelector('input');
    }
  }

  private changeColor() {
    if (!this.inputElement) return;

    if (this.inputElement.value.trim()) {
      this.renderer.setStyle(this.inputElement, 'border-color', 'green');
      this.renderer.setStyle(this.inputElement, 'background-color', '#e8f5e9');
    } else {
      this.renderer.setStyle(this.inputElement, 'border-color', 'red');
      this.renderer.setStyle(this.inputElement, 'background-color', '#ffebee');
    }
  }
}
