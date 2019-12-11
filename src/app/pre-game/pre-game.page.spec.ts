import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PreGamePage } from './pre-game.page';

describe('PreGamePage', () => {
  let component: PreGamePage;
  let fixture: ComponentFixture<PreGamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreGamePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PreGamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
