import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerDTO } from '../../interfaces/CustomerDTO';
import { CustomerRegistrationComponent } from './customer-registration/customer-registration-component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CustomerService } from '../../services/customer/customer.service';
import { ChangeDetectorRef } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
    selector: 'app-customer-list',
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        RouterModule,
        CustomerRegistrationComponent,
        ConfirmDialogModule,
        ToastModule,
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './customer-component.html',
})

export class CustomerComponent implements OnInit {
    constructor(
        private customerService: CustomerService,
        private cd: ChangeDetectorRef,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
    ) {
    }

    @ViewChild('registerModal') registerModal!: CustomerRegistrationComponent;
    @ViewChild('ct') table: any;

    loading: boolean = false;
    totalElements = 0;
    customers: CustomerDTO[] = [];

    ngOnInit(): void {
        //this.reloadCustomers();
    }

    openRegisterCustomer() {
        this.registerModal.open();
    }

    editCustomer(customer: CustomerDTO) {
        this.registerModal.edit(customer);
    }

    deleteCustomer(customer: CustomerDTO) {
        this.confirmationService.confirm({
            message: `Excluir o Cliente com CPF: "${customer.cpf} e Nome: ${customer.name}"?`,
            header: 'Confirmação',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.customerService.delete(customer.id).subscribe({
                    next: (result: any) => {
                        this.customers = this.customers.filter(c => c.id !== customer.id);
                        this.messageService.add({ severity: 'success', summary: 'Excluído', detail: `Cliente "${customer.name}" excluído.` });
                    },
                    error: (err: any) => {
                        this.messageService.add({ severity: 'error', summary: 'Error!', detail: err.error.error || err.error.message });
                    }
                });
            },
            reject: () => {
                this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Ação cancelada.' });
            }
        });
    }

    reloadCustomers() {
        this.table.first = 0;
        this.reloadCustomersLazy({
            first: 0,
            rows: 5,
            sortField: 'name',
            sortOrder: 1
        } as TableLazyLoadEvent);
    }

    reloadCustomersLazy(event: TableLazyLoadEvent) {
        this.loading = true;

        const first = event.first ?? 0;
        const rows = event.rows ?? 10;

        const page = first / rows;
        const size = rows;

        const sortField = event.sortField ?? 'name';
        const sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';
        const sort = `${sortField},${sortOrder}`;

        this.customerService.findAll(page, size, sort).subscribe({
            next: (result: any) => {
                this.customers = result.content ?? [];
                this.totalElements = result.totalElements ?? 0;
                this.cd.detectChanges();
                this.loading = false;
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: err.error.error || err.error.message });
                this.customers = [];
                this.totalElements = 0;
                this.loading = false;
                this.cd.detectChanges();
            }
        });
    }

    formatCpf(cpf: string): string {
        if (!cpf) return '';
        return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    }
}
