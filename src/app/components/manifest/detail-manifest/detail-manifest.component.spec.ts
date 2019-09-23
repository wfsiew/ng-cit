import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailManifestComponent } from './detail-manifest.component';

describe('DetailManifestComponent', () => {
  let component: DetailManifestComponent;
  let fixture: ComponentFixture<DetailManifestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailManifestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailManifestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
