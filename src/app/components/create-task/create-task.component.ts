import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { DateProcessingService } from 'src/app/services/dateProcessing.service';
import { TaskFieldsFormValidatorService } from 'src/app/services/taskFieldsFormValidator.service';
import { TasksApiService } from 'src/app/services/tasks-api.service';
import { Task } from '../../models/task';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})

export class CreateTaskComponent implements OnInit 
{
  private _parent!: AppComponent;
  @Input() set parent(value: AppComponent ) 
  {
    this._parent = value;
  }

  get parentClass(): AppComponent 
  {
    return this._parent;
  }

  @Input()
  sourceTasks: Task[] = [];

  onCreateTaskFormGroup = new FormGroup(
  {
    name: new FormControl(null, [Validators.required, this.taskFieldsFormValidatorService.ValidateNoWhitespaceString(), Validators.minLength(1), Validators.maxLength(32)]),
    description: new FormControl(null, [Validators.required, this.taskFieldsFormValidatorService.ValidateNoWhitespaceString(), Validators.minLength(1), Validators.maxLength(255)]),
    dueDate: new FormControl(null, [this.taskFieldsFormValidatorService.ValidateNotPastDate()])
  })

  get name(): FormControl
  {
    return this.onCreateTaskFormGroup.get("name") as FormControl;
  }

  get description(): FormControl
  {
    return this.onCreateTaskFormGroup.get("description") as FormControl;
  }

  get dueDate(): FormControl
  {
    return this.onCreateTaskFormGroup.get("dueDate") as FormControl;
  }

  constructor(
    protected tasksApi: TasksApiService,
    protected dateProcessingService: DateProcessingService,
    protected taskFieldsFormValidatorService: TaskFieldsFormValidatorService) 
  { 

  }

  ngOnInit(): void 
  {

  }

  ComputeNextValidID() : string
  {
    let nextIDStringCounter = 1;

    let taskIDs = this.sourceTasks.map(task => task.id.toString());
      
    // For ID, get smallest positive integer not present in array
    if (taskIDs.length > 0)
    {
      while (taskIDs.includes(nextIDStringCounter.toString()))
      {
        nextIDStringCounter += 1;
      };
    }
    else
    {
      nextIDStringCounter = 1;
    }

    return nextIDStringCounter.toString();
  }

  OnCreateTaskFormSubmit(goBackToTaskList: boolean): void
  {
    if (this.name.valid && 
        this.description.valid && 
        this.dueDate.valid)
    {
      let newTask: Task = {
        id: this.ComputeNextValidID(), 
        name: this.name.value, 
        description: this.description.value, 
        dueDate: this.dueDate.value == "" ? null : this.dueDate.value, 
        isCompleted: false
      };

      this.tasksApi.addTask(newTask).subscribe((tasks) => 
      {
        this.parentClass.GetAllTasks();
      });

      if (goBackToTaskList)
      {
        this.parentClass.ReturnToListView();
      }
      else
      {
        this.parentClass.GetAllTasks();
        alert("Task added. Fields cleared to add another entry.");
        this.onCreateTaskFormGroup.reset();
      }
    }
    else
    {
      this.DisplayCreateTaskFormErrorMessage();
    } 
  }

  DisplayCreateTaskFormErrorMessage(): void
  {
    var newLine = "\r\n";
    var errorMessage = "Please recheck the task entry for the following:\r\n";

    if (!(this.name.valid))
    {
      errorMessage += "- Name is required, and has a maximum length of 32 characters";
      errorMessage += newLine;
    }
    
    if (!(this.description.valid))
    {
      errorMessage += "- Description is required, and has a maximum length of 255 characters";
      errorMessage += newLine;
    }

    if (!(this.dueDate.valid))
    {
      errorMessage += "- Due Date is not required; but if provided, should not be a past date";
      errorMessage += newLine;
    }

    alert(errorMessage);
  }

  CancelTaskCreation(): void
  {
    this.parentClass.ReturnToListView();
  }
}