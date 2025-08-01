import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  private isBrowser!: boolean;  
  private nomeCurriculoTop: BehaviorSubject<string | null>;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    let initialValue: string | null = null;
    if (this.isBrowser) {
      initialValue = sessionStorage.getItem('nome');
    }

    this.nomeCurriculoTop = new BehaviorSubject<string | null>(initialValue);
  }

  getUserName(): Observable<string | null> {
    return this.nomeCurriculoTop.asObservable();
  }
  updateUserName(nome: string): void {
    if (this.isBrowser) {
      sessionStorage.setItem('nome', nome);
    }
    this.nomeCurriculoTop.next(nome);
  }
  //remove um item do session storage
  remove(value: string): void {
    if (this.isBrowser) {
      sessionStorage.removeItem(value);
    }
  }

  //limpa o session storage
  clear(): void {
    if (this.isBrowser) {
      sessionStorage.clear();
    }
  }


  setUserName(key: string, value: string): void {
    if (this.isBrowser) {
      sessionStorage.setItem(key, value);
    }
  }

  setCurriculo(key: string, value: string): void {
    if (this.isBrowser) {
      sessionStorage.setItem(key, value);
    }
  }

  getVaga(codVaga: any): string | null {
    if (this.isBrowser) {
      return sessionStorage.getItem(codVaga);
    }
    return null;
  }
  setVaga(codVaga: any, value: string): void {
    if (this.isBrowser) {
      sessionStorage.setItem(codVaga, value);
    }
  }
//getcurriculo pega o id do candidato
  getCurriculo() {
    if (this.isBrowser) {
      sessionStorage.getItem('id');
    }
  }
  setLogin(key: string, value: string): void {
    if (this.isBrowser) {
      sessionStorage.setItem(key, value);
    }
  }
  getLogin(key: string): string | null {
    if (this.isBrowser) {
      return sessionStorage.getItem(key);
    }
    return null;
  }
}
