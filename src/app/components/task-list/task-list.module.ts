import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from './task-list.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { TaskIsCompletedPipe } from 'src/app/pipes/taskIsCompleted.pipe';

@NgModule({
  declarations: [
    TaskListComponent,
    TaskIsCompletedPipe,
  ],
  imports: [
    CommonModule,
    PipesModule,
  ],
  exports:[
    TaskListComponent
  ]
})
export class ListMoviesModule { }
