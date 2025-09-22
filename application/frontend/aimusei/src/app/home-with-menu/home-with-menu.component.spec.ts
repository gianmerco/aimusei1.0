import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeWithMenuComponent } from './home-with-menu.component';

describe('HomeWithMenuComponent', () => {
  let component: HomeWithMenuComponent;
  let fixture: ComponentFixture<HomeWithMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeWithMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeWithMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
