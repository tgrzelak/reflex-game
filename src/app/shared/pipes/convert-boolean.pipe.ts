import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertBoolean'
})
export class ConvertBooleanPipe implements PipeTransform {

  transform(value: boolean, currentLang: string): any {
    switch (currentLang) {
      case 'pl':
        return value ? 'Tak' : 'Nie';
      case 'en':
        return value ? 'Yes' : 'No';
      default:
        return value ? 'Tak' : 'Nie';
    }
  }

}
