export interface LeaveBalance{
    employeeId: string;
    year: number;
    totalLeaves: number;
    usedLeaves: number;
    pendingLeaves: number;
    availableLeaves: number;
    leaveType: LeaveTypeBalance[];
    
}

export interface LeaveTypeBalance{
    leaveTypeId: number;
    leaveTypeName: string;
    total: number;
    used: number;
    available: number;
}

export interface LeaveApplication{
    id?: number;
    employeeId: string;
    employeeName?: string;
    leaveTypeId: number;
    leaveTypeName?: string;
    startDate: Date | string;
    endDate: Date;
    numberOfDays: number;
    reason: string;
    status : LeaveStatus;
    appliedDate?: Date | string;
    approvedBy?: number;
    approverName?: string;
    approvedDate?: Date | string;
    comments?: string;
    
}

export enum LeaveStatus{
    Pending = 'Pending',
    Approved = 'Approved',
    Rejected = 'Rejected',
    Cancelled = 'Cancelled'
}

export interface LeaveType{
    id: number;
    name: string;
    description: string;
    maxAllowedPerYear: number;
    isActive: boolean;
}

export interface LeaveApprovalRequest{
    leaveId:number;
    status:LeaveStatus;
    comments: string;
}