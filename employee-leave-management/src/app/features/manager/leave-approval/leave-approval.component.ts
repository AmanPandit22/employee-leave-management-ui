import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveService } from '../../../core/services/leave.service';
import {
  LeaveApplication,
  LeaveStatus,
  LeaveApprovalRequest,
} from '../../../core/models/leave.model';

@Component({
  selector: 'app-leave-approval',

  standalone: true,

  imports: [CommonModule, FormsModule],

  templateUrl: './leave-approval.component.html',

  styleUrls: ['./leave-approval.component.css'],
})
export class LeaveApprovalComponent implements OnInit {
  applications: LeaveApplication[] = [];

  filteredApplications: LeaveApplication[] = [];

  selectedApplication: LeaveApplication | null = null;

  loading = true;

  filterStatus: string = 'all';

  comments = '';

  processing = false;

  constructor(
    private leaveService: LeaveService,

    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.leaveService.getTeamLeaveApplications().subscribe({
      next: (applications) => {
        this.applications = applications;

        this.applyFilter();

        this.loading = false;
      },

      error: (error) => {
        console.error('Error loading applications:', error);

        this.loading = false;
      },
    });
  }

  applyFilter(): void {
    if (this.filterStatus === 'all') {
      this.filteredApplications = this.applications;
    } else {
      this.filteredApplications = this.applications.filter(
        (app) => app.status.toLowerCase() === this.filterStatus.toLowerCase()
      );
    }
  }

  onFilterChange(): void {
    this.applyFilter();
  }

  viewDetails(application: LeaveApplication): void {
    this.selectedApplication = application;

    this.comments = application.comments || '';
  }

  closeModal(): void {
    this.selectedApplication = null;

    this.comments = '';
  }

  approveLeave(): void {
    if (!this.selectedApplication) return;

    this.processing = true;

    const request: LeaveApprovalRequest = {
      leaveId: this.selectedApplication.id!,

      status: LeaveStatus.Approved,

      comments: this.comments,
    };

    this.leaveService.approveOrRejectLeave(request).subscribe({
      next: () => {
        alert('Leave approved successfully!');

        this.selectedApplication!.status = LeaveStatus.Approved;

        this.selectedApplication!.comments = this.comments;

        this.closeModal();

        this.processing = false;

        this.loadApplications();
      },

      error: (error) => {
        console.error('Error approving leave:', error);

        alert('Failed to approve leave');

        this.processing = false;
      },
    });
  }

  rejectLeave(): void {
    if (!this.selectedApplication) return;

    if (!this.comments.trim()) {
      alert('Please provide a reason for rejection');

      return;
    }

    this.processing = true;

    const request: LeaveApprovalRequest = {
      leaveId: this.selectedApplication.id!,

      status: LeaveStatus.Rejected,

      comments: this.comments,
    };

    this.leaveService.approveOrRejectLeave(request).subscribe({
      next: () => {
        alert('Leave rejected');

        this.selectedApplication!.status = LeaveStatus.Rejected;

        this.selectedApplication!.comments = this.comments;

        this.closeModal();

        this.processing = false;

        this.loadApplications();
      },

      error: (error) => {
        console.error('Error rejecting leave:', error);

        alert('Failed to reject leave');

        this.processing = false;
      },
    });
  }

  getStatusClass(status: LeaveStatus): string {
    switch (status) {
      case LeaveStatus.Approved:
        return 'status-approved';

      case LeaveStatus.Rejected:
        return 'status-rejected';

      case LeaveStatus.Pending:
        return 'status-pending';

      default:
        return '';
    }
  }

  goBack(): void {
    this.router.navigate(['/manager/dashboard']);
  }
}
