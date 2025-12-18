import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormArray,
    Validators
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CustomerService } from '../../../services/customer/customer.service';
import { ProductService } from '../../../services/product/product.service';
import { OrderService } from '../../../services/order/order.service';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { OrderDTO } from '../../../interfaces/OrderDTO';
import { MessageService } from 'primeng/api';


@Component({
    selector: 'app-order-registration',
    standalone: true,
    templateUrl: './order-registration-component.html',
    imports: [
        DialogModule,
        CommonModule,
        ReactiveFormsModule,
        SelectModule,
        InputNumberModule,
        ButtonModule
    ]
})
export class OrderRegistrationComponent implements OnInit {

    displayModal = false;
    isWatching = false;
    customers: any[] = [];
    products: any[] = [];
    nameView = '';
    totalView = 0;
    idView = 0;
    orderForm!: FormGroup;
    @Output() orderSaved = new EventEmitter<void>();

    constructor(
        private fb: FormBuilder,
        private customerService: CustomerService,
        private productService: ProductService,
        private orderService: OrderService,
        private cd: ChangeDetectorRef,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.orderForm = this.fb.group({
            customerId: [null, Validators.required],
            items: this.fb.array([])
        });

        this.loadCustomers();
        this.loadProducts();
        this.addItem();
    }

    get items(): FormArray {
        return this.orderForm.get('items') as FormArray;
    }

    addItem() {
        this.items.push(
            this.fb.group({
                productId: [null, Validators.required],
                quantity: [1, Validators.required]
            })
        );
    }

    removeItem(index: number) {
        this.items.removeAt(index);
    }

    saveOrder() {
        if (this.orderForm.invalid) return;
        
        const order = this.orderForm.getRawValue();
        this.orderService.create(order).subscribe({
            next: (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: `Pedido "${result.id}" Registrado com Sucesso!.` });
                this.displayModal = false;
                this.orderForm.reset();
                this.items.clear();
                this.addItem();
                this.orderSaved.emit();
            },
            error: (err: any) => {
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: err.error.error || err.error.message });
            }
        });
    }

    loadCustomers() {
        this.customerService.findAll(0, 99999, 'asc').subscribe(data => {
            this.customers = data.content;
            this.cd.detectChanges();
        });
    }

    loadProducts() {
        this.productService.findAll(0,999999,'asc').subscribe(data => {
            this.products = data.content;
            this.cd.detectChanges();
        });
    }

    openModal() {
        this.orderForm.enable();
        this.orderForm.reset();
        this.isWatching = false;
        this.displayModal = true;
        const itemsArray = this.orderForm.get('items') as FormArray;
        itemsArray.clear();
    }

    showOrder(order: OrderDTO) {
        this.isWatching = true;
        this.displayModal = true;
        this.totalView = order.total;
        this.nameView = order.customerName;
        this.idView = order.id;

        const itemsArray = this.orderForm.get('items') as FormArray;
        itemsArray.clear();

        order.items.forEach(item => {
            itemsArray.push(this.fb.group({
                productId: [{ value: item.productId, disabled: true }],
                quantity: [{ value: item.quantity, disabled: true }]
            }));
        });

        this.orderForm.disable();
    }

    get totalFormatted(): string {
        return `Total: ${this.totalView.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })}`;
    }


}
