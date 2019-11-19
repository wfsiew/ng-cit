import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintShipmentModalComponent } from './print-shipment-modal.component';

describe('PrintShipmentModalComponent', () => {
  let component: PrintShipmentModalComponent;
  let fixture: ComponentFixture<PrintShipmentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintShipmentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintShipmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
