import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'toka-theme';
  public isDarkMode = signal<boolean>(false);

  constructor() {
    this.initTheme();
  }

  private initTheme() {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      this.setDarkTheme();
    } else {
      this.setLightTheme();
    }
  }

  toggleTheme() {
    if (this.isDarkMode()) {
      this.setLightTheme();
    } else {
      this.setDarkTheme();
    }
  }

  private setDarkTheme() {
    this.isDarkMode.set(true);
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem(this.THEME_KEY, 'dark');
  }

  private setLightTheme() {
    this.isDarkMode.set(false);
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem(this.THEME_KEY, 'light');
  }
}
