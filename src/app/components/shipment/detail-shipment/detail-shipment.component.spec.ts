import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailShipmentComponent } from './detail-shipment.component';

describe('DetailShipmentComponent', () => {
  let component: DetailShipmentComponent;
  let fixture: ComponentFixture<DetailShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
