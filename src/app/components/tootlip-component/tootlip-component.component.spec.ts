import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TootlipComponentComponent } from './tootlip-component.component';

describe('TootlipComponentComponent', () => {
  let component: TootlipComponentComponent;
  let fixture: ComponentFixture<TootlipComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TootlipComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TootlipComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
