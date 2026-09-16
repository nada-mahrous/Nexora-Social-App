import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class MyTranslateService {
  private readonly translateService = inject(TranslateService);

  // i want to make english , arabic , french , german and italian
  changeDirection(): void {
    if (localStorage.getItem('lang') === 'en') {
      // dir --> ltr
      // lang --> en

      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    } else if (localStorage.getItem('lang') === 'ar') {
      // dir --> rtl
      // lang --> ar

      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else if (localStorage.getItem('lang') === 'fr') {
      // dir --> ltr
      // lang --> fr

      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'fr');
    } else if (localStorage.getItem('lang') === 'de') {
      // dir --> ltr
      // lang --> de

      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'de');
    } else if (localStorage.getItem('lang') === 'it') {
      // dir --> ltr
      // lang --> it

      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'it');
    }
  }

  changeLang(savedLang: string): void {
    localStorage.setItem('lang', savedLang);

    this.translateService.use(savedLang);

    this.changeDirection();
  }
}
