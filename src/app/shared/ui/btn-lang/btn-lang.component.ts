import { Component, inject } from '@angular/core';
import { MyTranslateService } from '../../../core/services/my-translate.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-btn-lang',
  imports: [],
  templateUrl: './btn-lang.component.html',
  styleUrl: './btn-lang.component.css',
})
export class BtnLangComponent {
  private readonly myTranslateService = inject(MyTranslateService);
  readonly translateService = inject(TranslateService);

  change(lang: string): void {
    this.myTranslateService.changeLang(lang);
  }
}
