import {  Directive, ElementRef, Renderer2, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appInputpreenchido]',
  standalone: true
})
export class InputpreenchidoDirective {

  constructor(private el: ElementRef,private renderer: Renderer2) { }

  ngOnInit() {
    this.changeColor()
  }
  @HostListener('input') onInputChange(){
    this.changeColor();
  }
  private changeColor(){
    const inputElement = this.el.nativeElement;
    if(inputElement.value.trim()){
      this.renderer.setStyle(inputElement, 'border-color', 'green');
      this.renderer.setStyle(inputElement, 'background-color', '#e8f5e9');
    }else{
      this.renderer.setStyle(inputElement, 'border-color', 'red');
      this.renderer.setStyle(inputElement, 'background-color', '#ffebee');
    }
    }

}
