import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAddressBookComponent } from './create-address-book.component';

describe('CreateAddressBookComponent', () => {
  let component: CreateAddressBookComponent;
  let fixture: ComponentFixture<CreateAddressBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAddressBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAddressBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
