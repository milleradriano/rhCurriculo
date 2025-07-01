import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  private isBrowser! : boolean;
  // private storage : window.localStorage;
private storage!: Storage;
private nomeCurriculoTop = new BehaviorSubject<string | null>(sessionStorage.getItem('nome'));
constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
getUserName():Observable<string | null> {

  return this.nomeCurriculoTop.asObservable();
}
updateUserName(nome: string): void {

  sessionStorage.setItem('nome', nome);
  this.nomeCurriculoTop.next(nome);
}
setUserName(key: string,value: string): void {
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

