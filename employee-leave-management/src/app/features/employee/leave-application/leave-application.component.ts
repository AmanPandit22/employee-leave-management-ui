import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { LeaveService } from '../../../core/services/leave.service';

import { AuthService } from '../../../core/services/auth.service';

import { LeaveType, LeaveApplication, LeaveStatus } from '../../../core/models/leave.model';

@Component({
    selector: 'app-leave-application',

    standalone: true,

    imports: [CommonModule, ReactiveFormsModule],

    templateUrl: './leave-application.component.html',

    styleUrls: ['./leave-application.component.css'],
})
export class LeaveApplicationComponent implements OnInit {
    leaveForm: FormGroup;

    leaveTypes: LeaveType[] = [];

    loading = false;

    success = false;

    error = '';

    constructor(
        private fb: FormBuilder,

        private leaveService: LeaveService,

        private authService: AuthService,

        private router: Router
    ) {
        this.leaveForm = this.fb.group({
            leaveTypeId: ['', Validators.required],

            startDate: ['', Validators.required],

            endDate: ['', Validators.required],

            reason: ['', [Validators.required, Validators.minLength(10)]],
        });
    }

    ngOnInit(): void {
        this.loadLeaveTypes();
    }

    loadLeaveTypes(): void {
        this.leaveService.getLeaveTypes().subscribe({
            next: (types) => {
                this.leaveTypes = types.filter((t) => t.isActive);
            },

            error: (error) => console.error('Error loading leave types:', error),
        });
    }

    get f() {
        return this.leaveForm.controls;
    }

    calculateDays(): number {
        const start = new Date(this.f['startDate'].value);

        const end = new Date(this.f['endDate'].value);

        if (!start || !end || end < start) return 0;

        const diffTime = Math.abs(end.getTime() - start.getTime());

        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        return diffDays;
    }

    onSubmit(): void {
        if (this.leaveForm.invalid) {
            Object.keys(this.leaveForm.controls).forEach((key) => {
                this.leaveForm.controls[key].markAsTouched();
            });

            return;
        }

        const user = this.authService.getCurrentUser();

        if (!user) return;

        this.loading = true;

        this.error = '';

        const application: LeaveApplication = {

            employeeId: user.employeeId,

            leaveTypeId: parseInt(this.f['leaveTypeId'].value),

            startDate: this.f['startDate'].value,

            endDate: this.f['endDate'].value,

            numberOfDays: this.calculateDays(),

            reason: this.f['reason'].value,

            status: LeaveStatus.Pending,
        };

        this.leaveService.applyLeave(application).subscribe({
            next: () => {
                this.success = true;

                this.loading = false;

                setTimeout(() => {
                    this.router.navigate(['/employee/dashboard']);
                }, 2000);
            },

            error: (error) => {
                this.error = 'Failed to submit leave application. Please try again.';

                this.loading = false;
            },
        });
    }

    cancel(): void {
        this.router.navigate(['/employee/dashboard']);
    }
}
