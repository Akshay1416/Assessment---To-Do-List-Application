import { Injectable } from '@angular/core';

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
  private tasks: Task[] = [
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
  private nextId: number = 5;

  constructor() { }

  getTasks(): Task[] {
    return [...this.tasks];
  }

  getTask(id: number): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  createTask(task: Task): Task {
    task.id = this.nextId++;
    this.tasks.push(task);
    return task;
  }

  updateTask(id: number, updatedTask: Task): Task | undefined {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index > -1) {
      this.tasks[index] = { ...updatedTask, id: id };
      return this.tasks[index];
    }
    return undefined;
  }

  deleteTask(id: number): boolean {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(task => task.id !== id);
    return this.tasks.length < initialLength;
  }
} 