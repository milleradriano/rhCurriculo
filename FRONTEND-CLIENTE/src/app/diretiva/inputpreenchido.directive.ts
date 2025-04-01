import { Directive, ElementRef, Renderer2, HostListener, AfterViewInit,OnDestroy, Injector } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
@Directive({
  selector: '[appInputpreenchido]',
  standalone: true
})
export class InputpreenchidoDirective implements AfterViewInit,OnDestroy {

  private inputElement: HTMLInputElement | null = null;
  private observer: MutationObserver | null = null;
  private control!: NgControl | null;
  private valueChangeSub!: Subscription;
  constructor(private el: ElementRef, private renderer: Renderer2,private injector: Injector) {}

  ngAfterViewInit() {
    // Espera o input ser renderizado dentro do p-password
    setTimeout(() => {
      this.findInputElement();
      this.detectFormControl();
      this.observeFormControl();
      this.changeColor();
    }, 0);
  }
  ngOnDestroy() {
    this.observer?.disconnect();
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
      this.renderer.setStyle(this.inputElement, 'width', '100%');
    } else {
      this.renderer.setStyle(this.inputElement, 'border-color', 'red');
      this.renderer.setStyle(this.inputElement, 'background-color', '#ffebee');
      this.renderer.setStyle(this.inputElement, 'width', '100%');
    }
  }

  private detectFormControl() {
    this.control = this.injector.get(NgControl, null);
  }

  private observeFormControl() {
    if (!this.control || !this.control.valueChanges) return;

    this.valueChangeSub = this.control.valueChanges.subscribe(() => {
      this.changeColor();
    });
  }

}
