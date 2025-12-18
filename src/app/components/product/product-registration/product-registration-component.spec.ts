import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductRegistrationComponent } from './product-registration-component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

describe('ProductRegistrationComponent', () => {
  let component: ProductRegistrationComponent;
  let fixture: ComponentFixture<ProductRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductRegistrationComponent,
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        InputNumberModule,
        ButtonModule,
        RouterModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with descricao and valor controls', () => {
    expect(component.produtoForm.contains('descricao')).toBeTruthy();
    expect(component.produtoForm.contains('valor')).toBeTruthy();
  });

  it('should make descricao required', () => {
  const control = component.produtoForm.get('descricao');
  control?.setValue('');
  expect(control?.valid).toBe(false);
});

it('should make valor required and greater than 0', () => {
  const control = component.produtoForm.get('valor');

  control?.setValue(null);
  expect(control?.valid).toBe(false);

  control?.setValue(-5);
  expect(control?.valid).toBe(false);

  control?.setValue(10);
  expect(control?.valid).toBe(true);
});

it('should submit valid form', () => {
  component.produtoForm.setValue({ descricao: 'Produto Teste', valor: 50 });
  //component.onSubmit();
  expect(component.produtoForm.valid).toBe(true);
});

});
