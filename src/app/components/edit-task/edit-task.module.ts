import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditTaskComponent } from './edit-task.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [EditTaskComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [EditTaskComponent]
})
export class EditTaskModule { }
