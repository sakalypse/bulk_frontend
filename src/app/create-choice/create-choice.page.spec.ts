import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateChoicePage } from './create-choice.page';

describe('CreateChoicePage', () => {
  let component: CreateChoicePage;
  let fixture: ComponentFixture<CreateChoicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateChoicePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateChoicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
