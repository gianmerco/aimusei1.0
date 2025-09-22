import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageIframeComponent } from './homepage-iframe.component';

describe('HomepageIframeComponent', () => {
  let component: HomepageIframeComponent;
  let fixture: ComponentFixture<HomepageIframeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomepageIframeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
