import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Task } from '../models/task';
import { TASKS_URL } from '../tokens/token';

@Injectable({
  providedIn: 'root'
})
export class TasksApiService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    @Inject(TASKS_URL) private tasksUrl: string) 
  {
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.tasksUrl)
      .pipe(
        tap((Tasks: Task[]) => console.log(`retrieved ${Tasks.length} Task`)),
        catchError(this.handleError<Task[]>([]))
      );
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.tasksUrl}/${id}`)
      .pipe(
        tap((Task: Task) => console.log(`retrieved Task id#${id}`)),
        catchError(this.handleError<Task>())
      );
  }

  addTask(Task: Task): Observable<Task> {
    return this.http.post<Task>(this.tasksUrl, Task, this.httpOptions).pipe(
      tap((newTask: Task) => console.log(`added Task w/ id=${newTask.id}`)),
      catchError(this.handleError<Task>())
    );
  }

  editTask(Task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.tasksUrl}/${Task.id}`, Task, this.httpOptions).pipe(
      tap(() => console.log(`edited Task w/ id=${Task.id}`)),
      catchError(this.handleError<Task>())
    );
  }

  deleteTask(Task: Task): Observable<Task> {
    return this.http.delete<Task>(`${this.tasksUrl}/${Task.id}`, this.httpOptions).pipe(
      tap(() => console.log(`delete Task w/ id=${Task.id}`)),
      catchError(this.handleError<Task>())
    );
  }

  private handleError<T>(result?: T ) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
