import { Component, ViewChild } from '@angular/core';
import { NavBarState } from 'src/app/models/navBarState';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { CreateTaskComponent } from './components/create-task/create-task.component';
import { TasksApiService } from './services/tasks-api.service';
import { Task } from 'src/app/models/task';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ndc-app';

  @ViewChild(NavigationBarComponent) navigationBarComponent : NavigationBarComponent | undefined;
  @ViewChild(TaskListComponent) taskListComponent : TaskListComponent | undefined;
  @ViewChild(CreateTaskComponent) createTaskComponent : CreateTaskComponent | undefined;
  @ViewChild(EditTaskComponent) editTaskComponent : EditTaskComponent | undefined;

  sourceTasks : Task[] = [];
  taskToEdit : Task | undefined;
  
  navBarState: NavBarState = {showList: true, showCreate: false, showEdit: false, shouldReloadScreen: false};
  showList: boolean = true;
  showCreate: boolean = false;
  showEdit: boolean = false;

  constructor(protected tasksApiService: TasksApiService) 
  {
  }

  ngOnInit(): void 
  {
    this.GetAllTasks();
  }

  get self(): AppComponent
  {
    return this;
  }

  GetAllTasks()
  {
    this.tasksApiService.getTasks().subscribe((tasks) => 
    {
      this.sourceTasks = tasks
    });
  }

  EditTask(taskToEdit: Task)
  {
    this.taskToEdit = taskToEdit;
    this.navigationBarComponent?.ShowEditComponent_navBar();
  }

  ReceiveNavBarOnClickBroadcast(navBarState: NavBarState): void 
  {
    this.navBarState = navBarState;
    this.showList = this.navBarState.showList;
    this.showCreate = this.navBarState.showCreate;
    this.showEdit = this.navBarState.showEdit;
    this.GetAllTasks();
    
    if (this.navBarState.shouldReloadScreen)
    {
      location.reload();
      this.navBarState.shouldReloadScreen = false;
    }
  }

  ReturnToListView(): void 
  {
    this.GetAllTasks();
    this.navigationBarComponent?.ShowListComponent_navBar();
  }
}
