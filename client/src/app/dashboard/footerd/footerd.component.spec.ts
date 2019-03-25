import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterdComponent } from './footerd.component';

describe('FooterdComponent', () => {
  let component: FooterdComponent;
  let fixture: ComponentFixture<FooterdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
