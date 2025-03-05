import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
/*
 this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
 showSuccess() {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
    }

    showWarn() {
        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Message Content' });
    }

    showError() {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Message Content' });
    }

    showContrast() {
        this.messageService.add({ severity: 'contrast', summary: 'Error', detail: 'Message Content' });

*/

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [ToastModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
@Injectable({ providedIn: 'root' })
export class ToastComponent {
  constructor(private messageService: MessageService) {}

  toast(severity: string, summary: string, detail: string) {
    this.messageService.add({ 
      severity: severity, summary: summary, detail: detail})
   
    }
  }
