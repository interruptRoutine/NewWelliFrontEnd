import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chisiamo } from './chisiamo';

describe('Chisiamo', () => {
  let component: Chisiamo;
  let fixture: ComponentFixture<Chisiamo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chisiamo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chisiamo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
