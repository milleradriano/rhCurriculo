import { Directive, ElementRef, Renderer2, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appInputreadonly]',
  standalone: true,
})
export class InputreadonlyDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.setAttribute(this.el.nativeElement, 'readonly', 'true');
  }
}
