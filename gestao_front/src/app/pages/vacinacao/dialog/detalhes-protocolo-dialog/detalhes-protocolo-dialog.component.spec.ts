import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesProtocoloDialogComponent } from './detalhes-protocolo-dialog.component';

describe('DetalhesProtocoloDialogComponent', () => {
  let component: DetalhesProtocoloDialogComponent;
  let fixture: ComponentFixture<DetalhesProtocoloDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesProtocoloDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesProtocoloDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
