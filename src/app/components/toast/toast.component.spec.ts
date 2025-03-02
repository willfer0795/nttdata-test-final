import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastComponent } from './toast.component';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToastComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a message to the messages array when showToast is called', () => {
    const initialLength = component.messages.length;
    component.showToast('Test message', 'info');
    expect(component.messages.length).toBe(initialLength + 1);
    expect(component.messages[initialLength]).toEqual({ text: 'Test message', type: 'info' });
  });

  it('should remove a message from the messages array when closeMessage is called', () => {
    component.messages.push({ text: 'Message to close', type: 'info' });
    const initialLength = component.messages.length;
    component.closeMessage();
    expect(component.messages.length).toBe(initialLength - 1);
  });

  it('should automatically close a message after a timeout if auto is true', (done) => {
    component.auto = true;
    component.timeClose = 1000; 
    const closeModalSpy = jest.spyOn(component, 'closeMessage');
    component.showToast('Auto-close message', 'info');
    setTimeout(() => {
      expect(closeModalSpy).toHaveBeenCalled();
      expect(component.messages.length).toBe(0);
      done();
    }, 1100);
  });

  it('should not automatically close a message if auto is false', () => {
    component.auto = false;
    component.showToast('Persistent message', 'info');

    setTimeout(() => {
      expect(component.messages.length).toBe(1);
    }, 1100);
  });
});
