import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertDifficulty'
})
export class ConvertDifficultyPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
