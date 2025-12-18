import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductComponent } from './product-component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

describe('ProductListComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductComponent,
        CommonModule,
        TableModule,
        ButtonModule,
        RouterModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have produtos array defined', () => {
    expect(component.produtos).toBeDefined();
    expect(component.produtos.length).toBeGreaterThan(0);
  });

  it('should render table rows equal to produtos length', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const rows = compiled.querySelectorAll('tbody tr');
    expect(rows.length).toBe(component.produtos.length);
  });
});
