import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineageContainerComponent } from './lineage-container.component';

describe('LineageContainerComponent', () => {
  let component: LineageContainerComponent;
  let fixture: ComponentFixture<LineageContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineageContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
