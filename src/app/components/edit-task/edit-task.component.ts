import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { DateProcessingService } from 'src/app/services/dateProcessing.service';
import { TaskFieldsFormValidatorService } from 'src/app/services/taskFieldsFormValidator.service';
import { TasksApiService } from 'src/app/services/tasks-api.service';
import { Task } from '../../models/task';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})

export class EditTaskComponent implements OnInit 
{
  private _parent!: AppComponent;
  @Input() set parent(value: AppComponent) 
  {
    this._parent = value;
  }

  get parentClass(): AppComponent 
  {
    return this._parent;
  }

  @Input()
  taskToEdit: Task | undefined;

  onEditTaskFormGroup = new FormGroup(
  {
    name: new FormControl(null, [Validators.required, this.taskFieldsFormValidatorService.ValidateNoWhitespaceString(), Validators.minLength(1), Validators.maxLength(32)]),
    description: new FormControl(null, [Validators.required, this.taskFieldsFormValidatorService.ValidateNoWhitespaceString(), Validators.minLength(1), Validators.maxLength(255)]),
    dueDate: new FormControl(null, [this.taskFieldsFormValidatorService.ValidateNotPastDate()]),
    status: new FormControl(null),
  })

  get name(): FormControl
  {
    return this.onEditTaskFormGroup.get("name") as FormControl;
  }

  get description(): FormControl
  {
    return this.onEditTaskFormGroup.get("description") as FormControl;
  }

  get dueDate(): FormControl
  {
    return this.onEditTaskFormGroup.get("dueDate") as FormControl;
  }

  get status(): FormControl
  {
    return this.onEditTaskFormGroup.get("status") as FormControl;
  }

  constructor(
    protected tasksApi: TasksApiService,
    protected dateProcessingService: DateProcessingService,
    protected taskFieldsFormValidatorService: TaskFieldsFormValidatorService) 
  { 

  }

  ngOnInit(): void 
  {
    this.LoadTaskToEdit();
  }

  LoadTaskToEdit(): void
  {
    // Add zeroes to months and days (with values 1 through 9)
    var convertedDateString = this.dateProcessingService.AddZeroesToDateString(this.taskToEdit?.dueDate ?? "");

    this.onEditTaskFormGroup.patchValue(
      {
        name: this.taskToEdit?.name,
        description: this.taskToEdit?.description,
        dueDate: convertedDateString,
        status: this.taskToEdit?.isCompleted? "Completed" : "Active"
      });
  }

  OnEditTaskFormSubmit(): void
  {
    if (this.name.valid && 
        this.description.valid && 
        (this.dueDate.valid || this.dueDate.untouched))
    {
      let editedTask: Task = {
        id: this.taskToEdit?.id ?? "Undefined ID", 
        name: this.name.value, 
        description: this.description.value, 
        dueDate: this.dueDate.value == "" ? null : this.dueDate.value, 
        isCompleted: this.status.value == "Completed" ? true : false
      };

      this.tasksApi.editTask(editedTask).subscribe((tasks) => 
      {

      });

      this.parentClass.ReturnToListView();
    }
    else
    {
      this.DisplayEditTaskFormErrorMessage();
    } 
  }

  DisplayEditTaskFormErrorMessage(): void
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

    if (!(this.dueDate.valid) && this.dueDate.touched)
    {
      errorMessage += "- Due Date is not required; but edits on it will not allow past dates";
      errorMessage += newLine;
    }

    alert(errorMessage);
  }

  CancelTaskEdit(): void
  {
    this.parentClass.ReturnToListView();
  }
}