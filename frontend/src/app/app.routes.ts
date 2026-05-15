import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HeroComponent } from './pages/hero/hero.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: HeroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'student-login', redirectTo: '/login', pathMatch: 'full' },
  { path: 'admin-login', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'register', 
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) 
  },
  { 
    path: 'admin/dashboard', 
    loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] }
  },
  { 
    path: 'admin/menu', 
    loadComponent: () => import('./pages/admin/menu/menu.component').then(m => m.MenuComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] }
  },
  { 
    path: 'admin/orders', 
    loadComponent: () => import('./pages/admin/orders/orders.component').then(m => m.OrdersComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] }
  },
  { 
    path: 'admin/complaints', 
    loadComponent: () => import('./pages/admin/complaints/complaints.component').then(m => m.ComplaintsComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] }
  },
  { 
    path: 'student/dashboard', 
    loadComponent: () => import('./pages/student/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Student', 'Teacher'] }
  },
  { 
    path: 'student/orders', 
    loadComponent: () => import('./pages/student/orders/orders.component').then(m => m.OrdersComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Student', 'Teacher'] }
  },
  { path: '**', redirectTo: '/login' }
];
