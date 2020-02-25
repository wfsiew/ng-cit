import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailInboundRetailOpsComponent } from './retail-inbound-retail-ops.component';

describe('RetailInboundRetailOpsComponent', () => {
  let component: RetailInboundRetailOpsComponent;
  let fixture: ComponentFixture<RetailInboundRetailOpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailInboundRetailOpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailInboundRetailOpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
