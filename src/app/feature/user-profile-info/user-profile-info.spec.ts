import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfileInfo } from './user-profile-info';
import { provideHttpClient } from '@angular/common/http';

describe('UserProfileInfo', () => {
  let component: UserProfileInfo;
  let fixture: ComponentFixture<UserProfileInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileInfo],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfileInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
