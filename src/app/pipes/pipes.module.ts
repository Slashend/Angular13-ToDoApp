import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskIsCompletedPipe } from './taskIsCompleted.pipe';

@NgModule({
  declarations: [
    TaskIsCompletedPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [TaskIsCompletedPipe]
})
export class PipesModule { }
