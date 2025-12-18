import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ProductService } from '../../../services/product/product.service';
import { ProductDTO } from '../../../interfaces/ProductDTO';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-product-registration',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, InputNumberModule, ButtonModule, DialogModule],
    templateUrl: './product-registration-component.html',
})

export class ProductRegistrationComponent {
    produtoForm: FormGroup;
    submitted = false;
    displayModal = false;
    isEditing = false;

    @Output() produtoSalvo = new EventEmitter<void>();

    constructor(
        private fb: FormBuilder,
        private productService: ProductService,
        private messageService: MessageService
    ) {
        this.produtoForm = this.fb.group({
            description: ['', [Validators.required]],
            value: [null, [Validators.required, Validators.min(0.01)]],
            id: [""]
        });
    }

    openModal() {
        this.isEditing = false;
        this.displayModal = true;
        this.submitted = false;
        this.produtoForm.reset();
    }

    edit(product: ProductDTO) {
        this.isEditing = true;
        this.displayModal = true;
        this.submitted = false;
        this.produtoForm.patchValue(product);
    }

    saveProduto() {
        this.submitted = true;
        if (this.produtoForm.invalid) return;

        if (this.isEditing) {
            this.updateProduct();
            return;
        }

        const product = this.produtoForm.getRawValue();
        this.productService.create(product).subscribe({
            next: (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: `Produto "${product.description}" Registrado com sucesso!.` });
                this.produtoSalvo.emit();
                this.displayModal = false;
            },
            error: (err: any) => {
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: err.error.error || err.error.message });
            }
        })

    }

    updateProduct() {
        const product = this.produtoForm.getRawValue();
        this.productService.update(product.id, product).subscribe({
            next: (result) => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: `Produto "${product.description}" Atualizado com sucesso!.` });
                this.produtoSalvo.emit();
                this.displayModal = false;
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: err.error.error || err.error.message });
            }
        });
    }

    get f() {
        return this.produtoForm.controls;
    }
}
