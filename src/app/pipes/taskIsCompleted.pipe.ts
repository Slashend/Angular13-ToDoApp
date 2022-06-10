import { Pipe, PipeTransform } from '@angular/core';

const TASK_COMPLETE_VALUE = "Completed";
const TASK_INCOMPLETE_VALUE = "Active";

@Pipe({
  name: 'taskIsCompleted'
})

export class TaskIsCompletedPipe implements PipeTransform 
{
  transform(value?: boolean): string 
  {
    if (value == undefined)
    {
      return TASK_INCOMPLETE_VALUE;
    }

    return value ? 
      TASK_COMPLETE_VALUE : 
      TASK_INCOMPLETE_VALUE;
  }
}
