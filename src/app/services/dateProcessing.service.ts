import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DateProcessingService 
{

  constructor() 
  {
  }

  AddZeroesToDateString(inputDateString : string): string
  {
    if (inputDateString == "")
    {
      return "";
    }

    var inputDate = new Date(inputDateString);

    var yearString = inputDate.getFullYear().toString();

    // Month starts at index 0 for some reason
    var month = (inputDate.getMonth() + 1);
    var monthString = month < 10 ? ("0" + month).toString() : month.toString();

    var day = inputDate.getDate();
    var dayString = day < 10 ? ("0" + day).toString() : day.toString();

    return yearString + "-" + monthString + "-" + dayString;
  }

  RemoveTimeFromDate(inputDate? : Date): Date
  {
    if (inputDate == null)
    {
      return new Date();
    }

    return new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate())
  }
}
