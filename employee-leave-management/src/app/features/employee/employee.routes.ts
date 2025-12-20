import { Routes } from '@angular/router';
import { authGuard, roleGuard } from '../../core/guards/auth.guard';

export const EMPLOYEE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, roleGuard],
    data: { role: 'Employee' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/employee-dashboard.component').then(m => m.EmployeeDashboardComponent),
      },
      // Add other employee routes like leave-application, leave-history
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];