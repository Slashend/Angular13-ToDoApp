import { Component, Input, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { Task } from 'src/app/models/task';
import { DateProcessingService } from 'src/app/services/dateProcessing.service';
import { TasksApiService } from 'src/app/services/tasks-api.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

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
  sourceTasks : Task[] = [];

  ShowActiveTasks: boolean = true;
  ShowCompletedTasks: boolean = true;
  ShowDueTasks: boolean = true;
  ShowLateTasks: boolean = true;

  constructor(
    protected tasksApi: TasksApiService,
    protected dateProcessingService: DateProcessingService)  
  { 

  }

  ngOnInit(): void 
  {

  }

  ShouldDisplayTask(task: Task): boolean
  {
    let taskDate = this.dateProcessingService.RemoveTimeFromDate(new Date(task.dueDate ?? new Date()));
    let dateToday = this.dateProcessingService.RemoveTimeFromDate(new Date());
    let result = true;

    if (!this.ShowActiveTasks)
    {
      if (task.isCompleted == false)
      {
        return false;
      }
    }

    if (!this.ShowCompletedTasks)
    {
      if (task.isCompleted == true)
      {
        return false;
      }
    }

    if (!this.ShowDueTasks)
    {
      // Due to how default date works, entries with NULL date are treated as DateTime.Today()
      if (taskDate >= dateToday)
      {
        return false;       
      }
    }

    if (!this.ShowLateTasks)
    {
      if (taskDate < dateToday)
      {
        return false;       
      }
    }

    return result;
  }

  ShowAllTasks(): void
  {
    this.ShowActiveTasks = true;
    this.ShowCompletedTasks = true;
    this.ShowDueTasks = true;
    this.ShowLateTasks = true;
  }

  ToggleActiveTasks(): void
  {
    this.ShowActiveTasks = !this.ShowActiveTasks;
  }

  ToggleCompletedTasks(): void
  {
    this.ShowCompletedTasks = !this.ShowCompletedTasks;
  }

  ToggleDueTasks(): void
  {
    this.ShowDueTasks = !this.ShowDueTasks;
  }

  ToggleLateTasks(): void
  {
    this.ShowLateTasks = !this.ShowLateTasks;
  }

  onTaskEdit(task: Task): void
  {
    this.parentClass.EditTask(task);
  }

  onTaskToggleStatus(task: Task): void
  {
    task.isCompleted = !task.isCompleted;
    this.tasksApi.editTask(task).subscribe((tasks) => 
    {

    });
  }

  onTaskDelete(task: Task): void
  {
    this.tasksApi.deleteTask(task).subscribe((tasks) => 
    {
      this.parentClass.GetAllTasks();
    });
  }
}
