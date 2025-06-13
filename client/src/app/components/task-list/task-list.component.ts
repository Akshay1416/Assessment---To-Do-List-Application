import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../../services/task.service';
import { TaskFormModalComponent } from '../task-form-modal/task-form-modal.component';
import { ConfirmDeleteModalComponent } from '../confirm-delete-modal/confirm-delete-modal.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgFor,
    NgIf,
    DatePipe,
    TaskFormModalComponent,
    ConfirmDeleteModalComponent
  ]
})
export class TaskListComponent implements OnInit {
  allTasks: Task[] = [];
  tasks: Task[] = []; // Tasks currently displayed on the page
  filteredTasks: Task[] = []; // Tasks after search filter
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 4; // As shown in screenshot
  totalPages: number = 1;
  openDropdownId: number | null = null;
  isLoading: boolean = false;

  showTaskFormModal: boolean = false;
  isEditMode: boolean = false;
  taskToEdit: Task | null = null;

  showDeleteModal: boolean = false;
  taskIdToDelete: number | null = null;
  taskTitleToDelete: string = '';

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  async loadTasks(): Promise<void> {
    try {
      this.isLoading = true;
      // Force a complete reload by clearing existing data
      this.allTasks = [];
      this.tasks = [];
      this.filteredTasks = [];
      
      // Get fresh data
      this.allTasks = this.taskService.getTasks();
      
      // Reset pagination
      this.currentPage = 1;
      
      // Apply filters and pagination
      this.applyFiltersAndPagination();
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      this.isLoading = false;
    }
  }

  applyFiltersAndPagination(): void {
    this.filteredTasks = this.allTasks.filter(task => 
      task.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(this.searchText.toLowerCase()) ||
      task.description.toLowerCase().includes(this.searchText.toLowerCase())
    );

    this.totalPages = Math.ceil(this.filteredTasks.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    } else if (this.totalPages === 0) {
      this.currentPage = 1; // Or handle empty state appropriately
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.tasks = this.filteredTasks.slice(startIndex, endIndex);
  }

  onSearchChange(): void {
    this.currentPage = 1; // Reset to first page on new search
    this.applyFiltersAndPagination();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFiltersAndPagination();
    }
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  // Modal for New/Edit Task
  openNewTaskModal(): void {
    this.isEditMode = false;
    this.taskToEdit = null;
    this.showTaskFormModal = true;
  }

  openEditTaskModal(task: Task): void {
    this.isEditMode = true;
    this.taskToEdit = { ...task }; // Create a copy to avoid direct mutation
    this.showTaskFormModal = true;
  }

  closeTaskFormModal(): void {
    this.showTaskFormModal = false;
    this.taskToEdit = null;
  }

  saveTask(task: Task): void {
    if (this.isEditMode) {
      this.taskService.updateTask(task.id, task);
    } else {
      this.taskService.createTask(task);
    }
    this.loadTasks(); // Reload tasks to update the list and pagination
    this.closeTaskFormModal();
  }

  // Modal for Delete Confirmation
  confirmDelete(task: Task): void {
    this.taskIdToDelete = task.id;
    this.taskTitleToDelete = task.title;
    this.showDeleteModal = true;
  }

  deleteTask(): void {
    if (this.taskIdToDelete !== null) {
      this.taskService.deleteTask(this.taskIdToDelete);
      this.loadTasks(); // Reload tasks to update the list and pagination
      this.closeDeleteModal();
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.taskIdToDelete = null;
    this.taskTitleToDelete = '';
  }

  toggleDropdown(taskId: number): void {
    this.openDropdownId = this.openDropdownId === taskId ? null : taskId;
  }

  isDropdownOpen(taskId: number): boolean {
    return this.openDropdownId === taskId;
  }
} 