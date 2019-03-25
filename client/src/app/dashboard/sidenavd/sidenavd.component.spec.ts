import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavdComponent } from './sidenavd.component';

describe('SidenavdComponent', () => {
  let component: SidenavdComponent;
  let fixture: ComponentFixture<SidenavdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenavdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
