import { Routes } from '@angular/router';
import { authGuard, roleGuard } from '../../core/guards/auth.guard';

export const MANAGER_ROUTES: Routes = [
    {
        path: '',
        canActivate: [authGuard, roleGuard],
        data: { role: 'Manager' },
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./dashboard/manager-dashboard.component').then(m => m.ManagerDashboardComponent),
            },
            {
                path: 'leave-approval',
                loadComponent: () => import('./leave-approval/leave-approval.component').then(m => m.LeaveApprovalComponent),
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            },
        ],
    },
];