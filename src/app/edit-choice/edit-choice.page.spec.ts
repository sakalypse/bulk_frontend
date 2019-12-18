import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditChoicePage } from './edit-choice.page';

describe('EditChoicePage', () => {
  let component: EditChoicePage;
  let fixture: ComponentFixture<EditChoicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditChoicePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditChoicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
