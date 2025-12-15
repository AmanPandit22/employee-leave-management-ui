import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import {

    LeaveBalance,
    LeaveApplication,
    LeaveType,
    LeaveApprovalRequest,
    LeaveStatus

} from '../models/leave.model';

@Injectable({

    providedIn: 'root'

})

export class LeaveService {

    private readonly API_URL = 'https://api.example.com/api'; // Replace with actual API

    constructor(private http: HttpClient) { }

    // Employee APIs

    getLeaveBalance(employeeId: string, year: number): Observable<LeaveBalance> {

        // return this.http.get<LeaveBalance>(`${this.API_URL}/leave/balance/${employeeId}/${year}`);

        return of(this.getDummyLeaveBalance(employeeId, year));

    }

    getMyLeaveApplications(employeeId: number): Observable<LeaveApplication[]> {

        // return this.http.get<LeaveApplication[]>(`${this.API_URL}/leave/my-applications/${employeeId}`);

        return of(this.getDummyLeaveApplications(employeeId));

    }

    applyLeave(application: LeaveApplication): Observable<LeaveApplication> {

        // return this.http.post<LeaveApplication>(`${this.API_URL}/leave/apply`, application);

        return of({ ...application, id: Math.floor(Math.random() * 1000), appliedDate: new Date() });

    }

    cancelLeave(leaveId: number): Observable<boolean> {

        // return this.http.put<boolean>(`${this.API_URL}/leave/cancel/${leaveId}`, {});

        return of(true);

    }

    // Manager APIs

    getPendingLeaveApplications(): Observable<LeaveApplication[]> {

        // return this.http.get<LeaveApplication[]>(`${this.API_URL}/leave/pending`);

        return of(this.getDummyPendingApplications());

    }

    getTeamLeaveApplications(): Observable<LeaveApplication[]> {

        // return this.http.get<LeaveApplication[]>(`${this.API_URL}/leave/team`);

        return of(this.getDummyTeamApplications());

    }

    approveOrRejectLeave(request: LeaveApprovalRequest): Observable<boolean> {

        // return this.http.put<boolean>(`${this.API_URL}/leave/approve-reject`, request);

        return of(true);

    }

    // Common APIs

    getLeaveTypes(): Observable<LeaveType[]> {

        // return this.http.get<LeaveType[]>(`${this.API_URL}/leave/types`);

        return of(this.getDummyLeaveTypes());

    }

    // Dummy data generators - remove when connecting to real API

    private getDummyLeaveBalance(employeeId: string, year: number): LeaveBalance {

        return {

            employeeId,

            year,

            totalLeaves: 24,

            usedLeaves: 8,

            pendingLeaves: 2,

            availableLeaves: 14,

            leaveType: [

                { leaveTypeId: 1, leaveTypeName: 'Annual Leave', total: 15, used: 5, available: 10 },

                { leaveTypeId: 2, leaveTypeName: 'Sick Leave', total: 7, used: 2, available: 5 },

                { leaveTypeId: 3, leaveTypeName: 'Casual Leave', total: 2, used: 1, available: 1 }

            ]

        };

    }

    private getDummyLeaveApplications(employeeId: number): LeaveApplication[] {

        return [

            {

                id: 1,

                employeeId,

                employeeName: 'Jane Employee',

                leaveTypeId: 1,

                leaveTypeName: 'Annual Leave',

                startDate: new Date('2024-12-20'),

                endDate: new Date('2024-12-22'),

                numberOfDays: 3,

                reason: 'Family vacation',

                status: LeaveStatus.Approved,

                appliedDate: new Date('2024-12-01'),

                approverName: 'John Manager',

                approvedDate: new Date('2024-12-02')

            },

            {

                id: 2,

                employeeId,

                employeeName: 'Jane Employee',

                leaveTypeId: 2,

                leaveTypeName: 'Sick Leave',

                startDate: new Date('2024-12-25'),

                endDate: new Date('2024-12-26'),

                numberOfDays: 2,

                reason: 'Medical appointment',

                status: LeaveStatus.Pending,

                appliedDate: new Date('2024-12-10')

            }

        ];

    }

    private getDummyPendingApplications(): LeaveApplication[] {

        return [

            {

                id: 3,

                employeeId: 2,

                employeeName: 'Jane Employee',

                leaveTypeId: 1,

                leaveTypeName: 'Annual Leave',

                startDate: new Date('2024-12-28'),

                endDate: new Date('2024-12-30'),

                numberOfDays: 3,

                reason: 'Personal work',

                status: LeaveStatus.Pending,

                appliedDate: new Date('2024-12-15')

            },

            {

                id: 4,

                employeeId: 3,

                employeeName: 'Bob Smith',

                leaveTypeId: 2,

                leaveTypeName: 'Sick Leave',

                startDate: new Date('2024-12-18'),

                endDate: new Date('2024-12-19'),

                numberOfDays: 2,

                reason: 'Fever',

                status: LeaveStatus.Pending,

                appliedDate: new Date('2024-12-16')

            }

        ];

    }

    private getDummyTeamApplications(): LeaveApplication[] {

        return [

            ...this.getDummyPendingApplications(),

            {

                id: 5,

                employeeId: 4,

                employeeName: 'Alice Johnson',

                leaveTypeId: 1,

                leaveTypeName: 'Annual Leave',

                startDate: new Date('2024-11-20'),

                endDate: new Date('2024-11-22'),

                numberOfDays: 3,

                reason: 'Wedding to attend',

                status: LeaveStatus.Approved,

                appliedDate: new Date('2024-11-01'),

                approverName: 'John Manager',

                approvedDate: new Date('2024-11-02')

            }

        ];

    }

    private getDummyLeaveTypes(): LeaveType[] {

        return [

            { id: 1, name: 'Annual Leave', description: 'Yearly vacation leave', maxAllowedPerYear: 15, isActive: true },

            { id: 2, name: 'Sick Leave', description: 'Medical leave', maxAllowedPerYear: 7, isActive: true },

            { id: 3, name: 'Casual Leave', description: 'Short notice leave', maxAllowedPerYear: 2, isActive: true },

            { id: 4, name: 'Maternity Leave', description: 'Maternity leave', maxAllowedPerYear: 90, isActive: true }

        ];

    }

}
