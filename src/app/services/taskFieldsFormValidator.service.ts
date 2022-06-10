import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { DateProcessingService } from './dateProcessing.service';

@Injectable({
  providedIn: 'root'
})

export class TaskFieldsFormValidatorService
{

  constructor(
    protected dateProcessingService: DateProcessingService) 
  {

  }

  ValidateNoWhitespaceString(): ValidatorFn 
  {
    return (control: AbstractControl): { [key:string]: any } | null => 
    {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : {'valid': false };
    };
  } 

  ValidateNotPastDate(): ValidatorFn 
  {
    return (control: AbstractControl): { [key:string]: any } | null => 
    {
      if (control.value == null)
      {
        return null;
      }
      else
      {
        const inputDate = this.dateProcessingService.RemoveTimeFromDate(new Date(control.value));
        const dateToday = this.dateProcessingService.RemoveTimeFromDate(new Date());

        if(inputDate < dateToday)
        {
          return {'valid': false };        
        }
        else
        {
          return null;
        }       
      }
    };
  } 
  
}
