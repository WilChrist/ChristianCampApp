import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderdComponent } from './headerd.component';

describe('HeaderdComponent', () => {
  let component: HeaderdComponent;
  let fixture: ComponentFixture<HeaderdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
