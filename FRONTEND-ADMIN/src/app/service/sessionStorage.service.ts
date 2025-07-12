import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  private isBrowser!: boolean;
  private storage!: Storage;
  private nomeTopo!: BehaviorSubject<string | null>;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    let initialValue: string | null = null;
    if (this.isBrowser) {
      initialValue = sessionStorage.getItem('nome');
    }
    this.nomeTopo = new BehaviorSubject<string | null>(initialValue);    
  }
  getUserName(): Observable<string | null> {
    return this.nomeTopo.asObservable();
  }
  updateUserName(nome: string): void {
    if (this.isBrowser) {
      sessionStorage.setItem('nome', nome);
    }
    this.nomeTopo.next(nome);
  }
  remove(value: string): void {
    if (this.isBrowser) {
      sessionStorage.removeItem(value);
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
