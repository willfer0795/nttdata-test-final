import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonListarComponent } from './skeleton-listar.component';

describe('SkeletonListarComponent', () => {
  let component: SkeletonListarComponent;
  let fixture: ComponentFixture<SkeletonListarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkeletonListarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
