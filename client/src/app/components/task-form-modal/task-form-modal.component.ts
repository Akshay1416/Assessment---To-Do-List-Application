import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { Task } from '../../services/task.service';

@Component({
  selector: 'app-task-form-modal',
  templateUrl: './task-form-modal.component.html',
  styleUrls: ['./task-form-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, DatePipe]
})
export class TaskFormModalComponent implements OnInit {
  @Input() isEditMode: boolean = false;
  @Input() task: Task | null = null;
  @Output() saveTask = new EventEmitter<Task>();
  @Output() cancel = new EventEmitter<void>();

  editableTask: Task = {
    id: 0,
    title: '',
    description: '',
    assignedTo: '',
    completed: false,
    dueDate: new Date(),
    priority: 'Normal'
  };

  priorities = ['Low', 'Normal', 'High'] as const;
  assignedUsers = ['User 1', 'User 2', 'User 3', 'User 4'];

  ngOnInit(): void {
    if (this.isEditMode && this.task) {
      this.editableTask = { ...this.task };
    } else {
      // Initialize new task with default values
      this.editableTask = {
        id: 0,
        title: '',
        description: '',
        assignedTo: this.assignedUsers[0] || '',
        completed: false,
        dueDate: new Date(),
        priority: this.priorities[1]
      };
    }
  }

  onSave(): void {
    this.saveTask.emit(this.editableTask);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  // Helper to format date for input type="date"
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  parseDate(dateString: string): Date {
    return new Date(dateString);
  }
} 