import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableLazyLoadEvent } from 'primeng/table';
import { OrderService } from '../../services/order/order.service';
import { OrderDTO } from '../../interfaces/OrderDTO';
import { OrderRegistrationComponent } from './order-registration/order-registration-component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-order',
    standalone: true,
    templateUrl: './order-component.html',
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        ToastModule,
        ConfirmDialogModule,
        OrderRegistrationComponent
    ],
    providers: [ConfirmationService, MessageService],
})
export class OrderComponent implements OnInit {
    
    orders: OrderDTO[] = [];
    loading: boolean = false;
    totalElements = 0;

    @ViewChild('ot') table: any;
    @ViewChild('orderModal') orderModal!: OrderRegistrationComponent;

    constructor(
        private orderService: OrderService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        //this.loadOrders();
        this.cd.detectChanges();
    }

    loadOrders() {
        this.table.first = 0;
        this.loadOrdersLazy({
            first: 0,
            rows: 5,
            sortField: 'createdAt',
            sortOrder: -1
        } as TableLazyLoadEvent);
    }

    loadOrdersLazy(event: TableLazyLoadEvent) {
        this.loading = true;

        const first = event.first ?? 0;
        const rows = event.rows ?? 10;

        const page = first / rows;
        const size = rows;

        const sortField = event.sortField ?? 'createdAt';
        const sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';
        const sort = `${sortField},${sortOrder}`;

        this.orderService.findAll(page, size, sort).subscribe({
            next: (result: any) => {
                this.orders = result.content;
                this.totalElements = result.totalElements;
                this.cd.detectChanges();
                this.loading = false;

            },
            error: () => {
                this.orders = [];
                this.totalElements = 0;
                this.loading = false;
                this.cd.detectChanges();
            }
        });
    }

    openRegisterOrder() {
        this.orderModal.openModal();
        this.cd.detectChanges();
    }

    onOrderSaved() {
        this.loadOrders();
        this.cd.detectChanges();
    }

    viewOrder(order: OrderDTO) {
        this.orderModal.showOrder(order);
    }
}
