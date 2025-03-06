import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  private isBrowser! : boolean;
  // private storage : window.localStorage;
private storage!: Storage;
constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  setCurriculo(key: string, value: string): void {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
    }
  }
  getCurriculo() {
    if (this.isBrowser) {
      localStorage.getItem('id');
    }
  }
  setLogin(key: string, value: string): void {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
    }
  }
  getLogin(key: string): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(key);
    }
    return null;
  }
}

