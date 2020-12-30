import { IndexedDbService } from './../services/indexed-db.service';
import { Subscription } from 'rxjs';
import { Pipe, PipeTransform, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

  private secondText: string;
  private millisecondText: string;
  private subscription: Subscription;
  constructor(
    private indexedDbService: IndexedDbService
  ) {
    this.subscription = this.indexedDbService.currentLang$.subscribe(
      currentLang => {
        console.log(currentLang);

        switch (currentLang) {
          case 'pl':
            this.secondText = 'Sekund';
            this.millisecondText = 'Milisekund';
            break;
          case 'en':
            this.secondText = 'Second';
            this.millisecondText = 'Millisecond';
        }
      }
    );
  }

  transform(value: any): any {
    console.log(this.secondText);

    return null;
  }

}
