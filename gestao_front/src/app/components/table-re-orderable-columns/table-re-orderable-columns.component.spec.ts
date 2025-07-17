import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableReOrderableColumnsComponent } from './table-re-orderable-columns.component';

describe('TableReOrderableColumnsComponent', () => {
  let component: TableReOrderableColumnsComponent;
  let fixture: ComponentFixture<TableReOrderableColumnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableReOrderableColumnsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableReOrderableColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
