import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListManifestComponent } from './list-manifest.component';

describe('ListManifestComponent', () => {
  let component: ListManifestComponent;
  let fixture: ComponentFixture<ListManifestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListManifestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListManifestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
