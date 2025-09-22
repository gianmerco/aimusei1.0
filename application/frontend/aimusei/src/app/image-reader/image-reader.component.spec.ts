import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageReaderComponent } from './image-reader.component';

describe('ImageReaderComponent', () => {
  let component: ImageReaderComponent;
  let fixture: ComponentFixture<ImageReaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageReaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
