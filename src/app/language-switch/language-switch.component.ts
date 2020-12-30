import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IndexedDbService } from './../shared/services/indexed-db.service';

@Component({
  selector: 'app-language-switch',
  templateUrl: './language-switch.component.html',
  styleUrls: ['./language-switch.component.scss']
})
export class LanguageSwitchComponent {

  constructor(
    private translate: TranslateService,
    private indexedDbService: IndexedDbService
  ) { }

  changeLanguage(language: 'pl' | 'en') {
    this.translate.use(language);
    this.indexedDbService.setCurrentLang(language);
  }

}
