import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AplicarVacinaDialogComponent } from './aplicar-vacina-dialog.component';

describe('AplicarVacinaDialogComponent', () => {
  let component: AplicarVacinaDialogComponent;
  let fixture: ComponentFixture<AplicarVacinaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AplicarVacinaDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AplicarVacinaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
