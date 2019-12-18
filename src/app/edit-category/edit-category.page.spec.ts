import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditCategoryPage } from './edit-category.page';

describe('EditCategoryPage', () => {
  let component: EditCategoryPage;
  let fixture: ComponentFixture<EditCategoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCategoryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditCategoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
