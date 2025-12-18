import { Component, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { UserRegistrationComponent } from '../user/user-registration/user-registration-component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    UserRegistrationComponent,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './login-component.html'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  @ViewChild('registerUserModal') registerUserModal: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService 
  ) {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/users']);
    }
  }

  execLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    const { login, senha } = this.loginForm.value;

    this.authService.login(login, senha).subscribe({
      next: res => {
        this.router.navigate(['/users']);
      },
      error: err => {
        this.messageService.add({ severity: 'error', summary: 'Error!', detail: err.error.error || err.error.message });
        console.error('Erro no login', err);
      }
    });

  }

  openRegister(){
    this.registerUserModal.openModal();
  }
}
