import { Directive, ElementRef, Renderer2, AfterViewInit, OnDestroy, Injector } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appCombopreenchido]',
  standalone: true
})
export class CombopreenchidoDirective implements AfterViewInit, OnDestroy {
  private control!: NgControl | null;
  private valueChangeSub!: Subscription;
  private dropdownLabel!: HTMLElement | null;

  constructor(private el: ElementRef, private renderer: Renderer2, private injector: Injector) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.findDropdownLabel();
      this.detectFormControl();
      this.updateBackgroundColor(this.control?.value);
      this.observeFormControl();
    }, 100); // Pequeno delay para garantir renderização
  }

  ngOnDestroy() {
    this.valueChangeSub?.unsubscribe();
  }

  private findDropdownLabel() {
    this.dropdownLabel = this.el.nativeElement.querySelector('.p-dropdown-label');
  }

  private detectFormControl() {
    this.control = this.injector.get(NgControl, null);
  }

  private observeFormControl() {
    if (!this.control || !this.control.valueChanges) return;

    this.valueChangeSub = this.control.valueChanges.subscribe(value => {
      this.updateBackgroundColor(value);
    });
  }

  private updateBackgroundColor(value: any) {
    if (!this.dropdownLabel) {
      this.findDropdownLabel(); // Tenta encontrar o label novamente se for necessário
    }
    if (!this.dropdownLabel) return;

    if (value) {
      this.renderer.setStyle(this.dropdownLabel, 'background-color', 'red');
    } else {
      this.renderer.setStyle(this.dropdownLabel, 'background-color', 'blue');
    }
  }
}
