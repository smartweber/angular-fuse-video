import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(time: number, type:string): any {
    if(!time) {
      time = 0;
    }

    let total = Math.floor(time * 100);
    let val: number;

    switch (type) {
      case "miniSec":
        val = total % 100;
        return val > 0 ? (val > 9 ? val.toString() : '0' + val.toString()) : '00';

      case "second":
        let valAsSec = Math.floor(total / 100);
        val = valAsSec % 100;
        return val > 0 ? (val > 9 ? val.toString() : '0' + val.toString()) : '00';

      case "minute":
        let valAsMinute = Math.floor(total / 6000);
        val = valAsMinute % 60;
        return val > 0 ? (val > 9 ? val.toString() : '0' + val.toString()) : '00';

      case "hours":
        let valAsHour = Math.floor(total / 360000);
        val = valAsHour % 60;
        return val > 0 ? (val > 9 ? val.toString() : '0' + val.toString()) : '00';
      
      default:
        return '00';
    }

  }

}
