import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodydComponent } from './bodyd.component';

describe('BodydComponent', () => {
  let component: BodydComponent;
  let fixture: ComponentFixture<BodydComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodydComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodydComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
