import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Router, RouterModule } from '@angular/router';

import { LeaveService } from '../../../core/services/leave.service';

import { AuthService } from '../../../core/services/auth.service';

import { LeaveBalance, LeaveApplication, LeaveStatus } from '../../../core/models/leave.model';

@Component({
  selector: 'app-employee-dashboard',

  standalone: true,

  imports: [CommonModule, RouterModule],

  templateUrl: './employee-dashboard.component.html',

  styleUrls: ['./employee-dashboard.component.css'],
})
export class EmployeeDashboardComponent implements OnInit {
  leaveBalance: LeaveBalance | null = null;

  recentApplications: LeaveApplication[] = [];

  loading = true;

  currentYear = new Date().getFullYear();

  userName = '';

  constructor(
    private leaveService: LeaveService,

    private authService: AuthService,

    private router: Router
  ) {
    const user = this.authService.getCurrentUser();

    this.userName = user ? `${user.FirstName} ${user.LastName}` : '';
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    const user = this.authService.getCurrentUser();

    if (!user) return;

    //Need to work on employeeId type consistently across the app
    this.leaveService.getLeaveBalance(user.id, this.currentYear).subscribe({
      next: (balance) => {
        this.leaveBalance = balance;
      },

      error: (error) => console.error('Error loading leave balance:', error),
    });

    this.leaveService.getMyLeaveApplications(user.id).subscribe({
      next: (applications) => {
        this.recentApplications = applications.slice(0, 5);

        this.loading = false;
      },

      error: (error) => {
        console.error('Error loading applications:', error);

        this.loading = false;
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

  applyLeave(): void {
    this.router.navigate(['/employee/apply-leave']);
  }

  viewHistory(): void {
    this.router.navigate(['/employee/leave-history']);
  }

  logout(): void {
    this.authService.logout();
  }
}
