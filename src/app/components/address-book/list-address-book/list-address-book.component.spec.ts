import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAddressBookComponent } from './list-address-book.component';

describe('ListAddressBookComponent', () => {
  let component: ListAddressBookComponent;
  let fixture: ComponentFixture<ListAddressBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAddressBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAddressBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
