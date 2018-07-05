import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayAsTextarea'
})
export class DisplayAsTextareaPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value ? String(value).replace(new RegExp('\n', 'g'), "<br />") : '';
  }

}
