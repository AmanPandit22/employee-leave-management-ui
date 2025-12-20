import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    },
    {
        path: 'manager',
        loadChildren: () => import('./features/manager/manager.routes').then(m => m.MANAGER_ROUTES),
    },
    {
        path: 'employee',
        loadChildren: () => import('./features/employee/employee.routes').then(m => m.EMPLOYEE_ROUTES),
    },
    {
        path: '**',
        redirectTo: '/login',
    },
];
