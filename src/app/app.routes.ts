import { Routes } from '@angular/router';



export const routes: Routes = [
  {
    path: 'customers',
    loadComponent: () =>
      import('./components/customer/customer-component').then(c => c.CustomerComponent)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login-component').then(c => c.LoginComponent)
  },
  {
    path: 'user-register',
    loadComponent: () =>
      import('./components/user/user-registration/user-registration-component').then(c => c.UserRegistrationComponent)
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./components/user/user-component').then(c => c.UsersComponent)
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./components/product/product-component').then(c => c.ProductComponent)
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./components/order/order-component').then(c => c.OrderComponent)
  }
];

