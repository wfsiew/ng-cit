import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadsheetRetailOpsComponent } from './loadsheet-retail-ops.component';

describe('LoadsheetRetailOpsComponent', () => {
  let component: LoadsheetRetailOpsComponent;
  let fixture: ComponentFixture<LoadsheetRetailOpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadsheetRetailOpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadsheetRetailOpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
