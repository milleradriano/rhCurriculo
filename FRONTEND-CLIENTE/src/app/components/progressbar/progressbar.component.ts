import { Component, Input } from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-progressbar',
  standalone: true,
  imports: [MatProgressBarModule],
  templateUrl: './progressbar.component.html',
  styleUrl: './progressbar.component.css'
})
export class ProgressbarComponent {
  @Input()
progress: number = 10
  constructor(
  private router: Router
  ) {}
ngOnInit(): void { 
  this.carrega()
}

carrega(){
  this.progress += 10;
  console.log('carregando ', this.progress);
  setInterval(() => {

this.progress += 1;
if (this.progress === 100) {

  this.router.navigate(['/']);
}
  }, 100);
}
}
