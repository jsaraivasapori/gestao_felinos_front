import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacinaDialogComponent } from './vacina-dialog.component';

describe('VacinaDialogComponent', () => {
  let component: VacinaDialogComponent;
  let fixture: ComponentFixture<VacinaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacinaDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacinaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
