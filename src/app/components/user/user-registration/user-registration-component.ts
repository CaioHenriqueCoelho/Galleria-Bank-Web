import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { UserDTO } from '../../../interfaces/UserDTO';

@Component({
  standalone: true,
  selector: 'app-user-registration',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, PasswordModule, ToastModule, DialogModule],
  providers: [MessageService],
  templateUrl: './user-registration-component.html',
  styleUrls: ['./user-registration-component.scss']
})
export class UserRegistrationComponent implements OnInit {
  @Output() userSaved = new EventEmitter<any>();
  registerForm!: FormGroup;
  submitted = false;
  isEditing: boolean = false;
  existingLogins: string[] = ['usuario1', 'admin'];
  displayModal: boolean = false;
  constructor(private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      login: ['', [Validators.required, this.loginUniqueValidator.bind(this)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      id: ['']
    });
  }

  loginUniqueValidator(control: any) {
    if (this.existingLogins.includes(control.value)) {
      return { loginExists: true };
    }
    return null;
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) return;

    if (this.isEditing) {
      this.updateUser();
      return;
    }

    const usuario = this.registerForm.getRawValue();
    this.userService.register(usuario).subscribe({
      next: (result: any) => {
        this.messageService.add({ severity: 'success', summary: 'Registrado', detail: `Usuário "${result.name}" Registrado com sucesso!.`, life: 5000 });
        this.displayModal = false;
        this.registerForm.reset();
        this.userSaved.emit(result);
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error!', detail: err.error.error || err.error.message });
      }
    });

  }

  openModal() {
    this.registerForm.reset();
    this.isEditing = false;
    this.displayModal = true;
    this.submitted = false;
  }

  updateUser() {
    const user = this.registerForm.getRawValue();

    this.userService.update(user.id, user).subscribe({
      next: (result: any) => {
        this.messageService.add({ severity: 'success', summary: 'Atualizado', detail: `Usuário "${result.name}" Atualizado com sucesso!.`, life: 5000 });
        this.displayModal = false;
        this.registerForm.reset();
        this.userSaved.emit(result);
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error!', detail: err.error.error || err.error.message });
      }
    });
  }

  show(user: UserDTO) {
    this.registerForm.patchValue({});
    this.isEditing = true;
    this.displayModal = true;
    this.registerForm.patchValue(user);
  }

  get f() {
    return this.registerForm.controls;
  }
}
