import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressBookModalComponent } from './address-book-modal.component';

describe('AddressBookModalComponent', () => {
  let component: AddressBookModalComponent;
  let fixture: ComponentFixture<AddressBookModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressBookModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressBookModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
