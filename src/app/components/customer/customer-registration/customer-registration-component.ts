import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CustomerDTO } from '../../../interfaces/CustomerDTO'
import { CustomerService } from '../../../services/customer/customer.service';
import { MessageService } from 'primeng/api';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
    selector: 'app-customer-registration',
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, InputNumberModule, ButtonModule, DialogModule, InputMaskModule],
    templateUrl: './customer-registration-component.html',
})
export class CustomerRegistrationComponent {

    @Output() customerSaved = new EventEmitter<void>();

    displayModal = false;
    isEditing = false;
    submitted = false;

    customerForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private customerService: CustomerService,
        private messageService: MessageService
    ) {
        this.customerForm = this.fb.group({
            id: [null],
            name: ['', [Validators.required, Validators.minLength(3)]],
            cpf: ['', [
                Validators.required,
                Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
            ]],
            phone: ['']
        });
    }

    get f() {
        return this.customerForm.controls;
    }

    edit(customer: CustomerDTO) {
        this.isEditing = true;
        this.displayModal = true;
        this.submitted = false;
        const formattedCustomer = {
            ...customer,
            cpf: this.formatCpf(customer.cpf)
        };

        this.customerForm.patchValue(formattedCustomer);

    }

    open() {
        this.customerForm.reset();
        this.isEditing = false;
        this.displayModal = true;
        this.submitted = false;
    }

    saveCustomer() {
        if (this.customerForm.invalid) return;

        this.submitted = true;

        if (this.isEditing) {
            this.updateCustomer();
            return;
        }

        const customer = this.customerForm.getRawValue();
        this.customerService.create(customer).subscribe({
            next: (result: any) => {
                this.displayModal = false;
                this.customerSaved.emit();
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `Cliente "${customer.name}" foi registrado.` });
            },
            error: (err: any) => {
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: err.error.error || err.error.message });
            }
        });
    }

    updateCustomer() {
        const customer = this.customerForm.getRawValue();
        this.customerService.update(customer.id, customer).subscribe({
            next: (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `Cliente "${customer.name}" foi atualizado.` });
                this.displayModal = false;
                this.customerSaved.emit();
            },
            error: (err: any) => {
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: err.error.error || err.error.message });
            }
        });

    }

    formatCpf(cpf: string): string {
        if (!cpf) return '';
        return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    }


}
