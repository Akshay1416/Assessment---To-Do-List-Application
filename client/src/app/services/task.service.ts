import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Task {
  id: number;
  title: string;
  description: string;
  assignedTo: string;
  completed: boolean;
  dueDate: Date;
  priority: 'Low' | 'Normal' | 'High';
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  private nextId: number = 1;
  private readonly STORAGE_KEY = 'tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  constructor() {
    this.loadTasks();
  }

  private loadTasks(): void {
    try {
      const storedTasks = localStorage.getItem(this.STORAGE_KEY);
      if (storedTasks) {
        this.tasks = JSON.parse(storedTasks).map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate)
        }));
        this.nextId = Math.max(...this.tasks.map(t => t.id), 0) + 1;
      } else {
        this.initializeDefaultTasks();
      }
      this.tasksSubject.next([...this.tasks]);
    } catch (error) {
      console.error('Error loading tasks:', error);
      this.initializeDefaultTasks();
    }
  }

  private initializeDefaultTasks(): void {
    this.tasks = [
      {
        id: 1,
        title: 'Prepare presentation',
        description: 'Finish slides for Q3 review',
        assignedTo: 'User 1',
        completed: true,
        dueDate: new Date('2024-10-12'),
        priority: 'High'
      },
      {
        id: 2,
        title: 'Review proposal',
        description: 'Check client proposal for errors',
        assignedTo: 'User 2',
        completed: false,
        dueDate: new Date('2024-09-14'),
        priority: 'Normal'
      },
      {
        id: 3,
        title: 'Team meeting',
        description: 'Discuss project milestones',
        assignedTo: 'User 3',
        completed: false,
        dueDate: new Date('2024-08-18'),
        priority: 'Low'
      },
      {
        id: 4,
        title: 'Follow up with client',
        description: 'Regarding new feature request',
        assignedTo: 'User 4',
        completed: false,
        dueDate: new Date('2024-06-12'),
        priority: 'Normal'
      }
    ];
    this.nextId = 5;
    this.saveTasks();
  }

  private saveTasks(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
      this.tasksSubject.next([...this.tasks]);
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }

  getTasks(): Task[] {
    this.loadTasks(); // Force reload from storage
    return [...this.tasks];
  }

  getTask(id: number): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  createTask(task: Task): Task {
    task.id = this.nextId++;
    this.tasks.push(task);
    this.saveTasks();
    return task;
  }

  updateTask(id: number, updatedTask: Task): Task | undefined {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index > -1) {
      this.tasks[index] = { ...updatedTask, id: id };
      this.saveTasks();
      return this.tasks[index];
    }
    return undefined;
  }

  deleteTask(id: number): boolean {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveTasks();
    return this.tasks.length < initialLength;
  }

  // Observable for task updates
  getTasksObservable(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }
} 