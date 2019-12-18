import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditQuestionPage } from './edit-question.page';

describe('EditQuestionPage', () => {
  let component: EditQuestionPage;
  let fixture: ComponentFixture<EditQuestionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditQuestionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditQuestionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
