import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { ProductDTO } from '../../interfaces/ProductDTO';
import { ProductRegistrationComponent } from './product-registration/product-registration-component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../services/product/product.service';
import { ChangeDetectorRef } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
    selector: 'app-product',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        RouterModule,
        ProductRegistrationComponent,
        ConfirmDialogModule,
        ToastModule
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './product-component.html',
    styleUrls: ['./product-component.scss']
})
export class ProductComponent implements OnInit {

    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private productService: ProductService,
        private cd: ChangeDetectorRef
    ) { }


    produtos: ProductDTO[] = [];
    loading: boolean = false;
    totalElements = 0;

    @ViewChild('registerModal') registerModal!: ProductRegistrationComponent;
    @ViewChild('pt') table: any;

    ngOnInit(): void {
        //this.getProducts();
    }

    getProducts() {
        this.table.first = 0;
        this.loadProductsLazy({
            first: 0,
            rows: 5,
            sortField: 'value',
            sortOrder: 1
        } as TableLazyLoadEvent);
    }

    loadProductsLazy(event: TableLazyLoadEvent) {
        this.loading = true;

        const first = event.first ?? 0;
        const rows = event.rows ?? 10;

        const page = first / rows;
        const size = rows;

        const sortField = event.sortField ?? 'value';
        const sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';
        const sort = `${sortField},${sortOrder}`;

        this.productService.findAll(page, size, sort).subscribe({
            next: (result: any) => {
                this.produtos = result.content ?? [];
                this.totalElements = result.totalElements ?? 0;
                this.cd.detectChanges();
                this.loading = false;
            },
            error: () => {
                this.produtos = [];
                this.totalElements = 0;
                this.loading = false;
                this.cd.detectChanges();
            }
        });
    }


    openRegisterProduct() {
        this.registerModal.openModal();
    }

    editProduct(product: ProductDTO) {
        this.registerModal.edit(product);
    }

    reloadProdutos() {
        this.getProducts();
    }

    deleteProduct(produto: ProductDTO) {
        this.confirmationService.confirm({
            message: `Deseja realmente excluir o produto "${produto.description}"?`,
            header: 'Confirmação',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.productService.delete(produto.id).subscribe({
                    next: (result: any) => {
                        this.messageService.add({ severity: 'success', summary: 'Excluído', detail: `Produto "${produto.description}" excluído.` });
                        this.produtos = this.produtos.filter(p => p.id !== produto.id);
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
}
