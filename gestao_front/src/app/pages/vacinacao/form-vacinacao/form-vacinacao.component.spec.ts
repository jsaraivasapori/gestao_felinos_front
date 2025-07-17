import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormVacinacaoComponent } from './form-vacinacao.component';

describe('FormVacinacaoComponent', () => {
  let component: FormVacinacaoComponent;
  let fixture: ComponentFixture<FormVacinacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormVacinacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormVacinacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
