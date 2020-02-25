import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentInfoRetailInboundComponent } from './shipment-info-retail-inbound.component';

describe('ShipmentInfoRetailInboundComponent', () => {
  let component: ShipmentInfoRetailInboundComponent;
  let fixture: ComponentFixture<ShipmentInfoRetailInboundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentInfoRetailInboundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentInfoRetailInboundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
