import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { ComplaintService, Complaint } from '../../../services/complaint.service';

@Component({
  selector: 'app-complaints',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent],
  template: `
<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
  <app-navbar></app-navbar>

  <div class="flex flex-1 overflow-hidden relative">
    <app-sidebar [role]="'Admin'"></app-sidebar>

    <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div class="max-w-7xl mx-auto">
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Student Complaints & Feedback</h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">Review and resolve issues reported by students.</p>
        </div>

        <div *ngIf="loading" class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>

        <div *ngIf="!loading && complaints.length > 0" class="space-y-4">
          <div *ngFor="let complaint of complaints" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col sm:flex-row gap-4 justify-between">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <span class="px-2.5 py-1 text-xs font-bold rounded-md"
                      [ngClass]="complaint.status === 'Open' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'">
                  {{ complaint.status }}
                </span>
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ complaint.createdAt | date:'short' }}</span>
              </div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">{{ complaint.subject }}</h3>
              <p class="text-gray-600 dark:text-gray-300 text-sm mb-3">{{ complaint.message }}</p>
              <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {{ complaint.userId?.name || 'Unknown User' }} ({{ complaint.userId?.email }})
              </div>
            </div>
            
            <div class="flex items-start sm:items-center sm:justify-end shrink-0">
              <button *ngIf="complaint.status === 'Open'" (click)="resolveComplaint(complaint)"
                      class="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl text-sm font-bold transition-colors">
                Mark as Resolved
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="!loading && complaints.length === 0" class="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">No complaints found</h3>
          <p class="text-gray-500 dark:text-gray-400">Everything is running smoothly!</p>
        </div>
      </div>
    </main>
  </div>
</div>
  `
})
export class ComplaintsComponent implements OnInit {
  complaints: Complaint[] = [];
  loading = true;

  constructor(private complaintService: ComplaintService) {}

  ngOnInit() {
    this.fetchComplaints();
  }

  fetchComplaints() {
    this.loading = true;
    this.complaintService.getAllComplaints().subscribe({
      next: (data) => {
        this.complaints = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  resolveComplaint(complaint: Complaint) {
    if(!complaint._id) return;
    this.complaintService.updateComplaintStatus(complaint._id, 'Resolved').subscribe(() => {
      complaint.status = 'Resolved';
    });
  }
}
