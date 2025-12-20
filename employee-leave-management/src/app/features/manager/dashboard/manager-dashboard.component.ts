import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Router, RouterModule } from '@angular/router';

import { LeaveService } from '../../../core/services/leave.service';

import { AuthService } from '../../../core/services/auth.service';

import { LeaveApplication, LeaveStatus } from '../../../core/models/leave.model';

@Component({
    selector: 'app-manager-dashboard',

    standalone: true,

    imports: [CommonModule, RouterModule],

    templateUrl: './manager-dashboard.component.html',

    styleUrls: ['./manager-dashboard.component.css'],
})
export class ManagerDashboardComponent implements OnInit {
    pendingApplications: LeaveApplication[] = [];

    recentApplications: LeaveApplication[] = [];

    loading = true;

    userName = '';

    stats = {
        pending: 0,

        approved: 0,

        rejected: 0,
    };

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
        this.leaveService.getPendingLeaveApplications().subscribe({
            next: (applications) => {
                this.pendingApplications = applications;

                this.stats.pending = applications.length;
            },

            error: (error) => console.error('Error loading pending applications:', error),
        });

        this.leaveService.getTeamLeaveApplications().subscribe({
            next: (applications) => {
                this.recentApplications = applications.slice(0, 10);

                this.stats.approved = applications.filter((a) => a.status === LeaveStatus.Approved).length;

                this.stats.rejected = applications.filter((a) => a.status === LeaveStatus.Rejected).length;

                this.loading = false;
            },

            error: (error) => {
                console.error('Error loading team applications:', error);

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

    viewApprovals(): void {
        this.router.navigate(['/manager/approvals']);
    }

    logout(): void {
        this.authService.logout();
    }
}
