import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputadoresComponent } from './computador.component';

describe('ComputadorComponent', () => {
  let component: ComputadoresComponent;
  let fixture: ComponentFixture<ComputadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComputadoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComputadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
