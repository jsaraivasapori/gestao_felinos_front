import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNewVaccineComponent } from './form-new-vaccine.component';

describe('FormNewVaccineComponent', () => {
  let component: FormNewVaccineComponent;
  let fixture: ComponentFixture<FormNewVaccineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormNewVaccineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormNewVaccineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
