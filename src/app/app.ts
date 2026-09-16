import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { MyTranslateService } from './core/services/my-translate.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly translateService = inject(TranslateService);
  private readonly myTranslateService = inject(MyTranslateService);

  saveLang = localStorage.getItem('lang');

  constructor() {
    this.translateService.addLangs(['ar', 'en', 'fr', 'de', 'it']);

    if (this.saveLang) {
      this.translateService.use(this.saveLang);
      this.myTranslateService.changeDirection();
    }
  }
}
