import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMultipleShipmentComponent } from './create-multiple-shipment.component';

describe('CreateMultipleShipmentComponent', () => {
  let component: CreateMultipleShipmentComponent;
  let fixture: ComponentFixture<CreateMultipleShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMultipleShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMultipleShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
