import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserProfileInfo } from './user-profile-info';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProfileService } from '../../shared/services/profile.service';
import { UserStreamService } from '../../shared/services/user-stream.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { of, throwError } from 'rxjs';
import { EmhLoadingComponent } from '../../shared/components/emh-loading-component/emh-loading-component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserResponseTypes } from "../../shared/DTO/user";

describe('UserProfileInfo', () => {
  let component: UserProfileInfo;
  let fixture: ComponentFixture<UserProfileInfo>;
  let profileService: jasmine.SpyObj<ProfileService>;
  let userStreamService: jasmine.SpyObj<UserStreamService>;
  let snackbar: jasmine.SpyObj<SnackbarService>;

  const mockUser = {
    id: 'PAT-0001',
    type: UserResponseTypes.DOCTOR,
    firstName: 'John',
    lastname: 'Doe',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com'
  };

  const mockProfile = {
    id: 'PAT-0001',
    first_name: 'John',
    last_name: 'Doe',
    dob: '1990-01-01',
    email: 'john.doe@example.com',
    phone: '+64 12345678'
  };

  beforeEach(async () => {
    const profileSpy = jasmine.createSpyObj('ProfileService', ['getProfile', 'resetProfile']);
    const userStreamSpy = jasmine.createSpyObj('UserStreamService', ['getCurrentUserFromStorage']);
    const snackbarSpy = jasmine.createSpyObj('SnackbarService', ['openSnackbarWithAction']);

    await TestBed.configureTestingModule({
      imports: [
        UserProfileInfo,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatIconModule,
        MatButtonModule,
        EmhLoadingComponent
      ],
      providers: [
        { provide: ProfileService, useValue: profileSpy },
        { provide: UserStreamService, useValue: userStreamSpy },
        { provide: SnackbarService, useValue: snackbarSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileInfo);
    component = fixture.componentInstance;

    profileService = TestBed.inject(ProfileService) as jasmine.SpyObj<ProfileService>;
    userStreamService = TestBed.inject(UserStreamService) as jasmine.SpyObj<UserStreamService>;
    snackbar = TestBed.inject(SnackbarService) as jasmine.SpyObj<SnackbarService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize profileForm on ngOnInit', () => {
    userStreamService.getCurrentUserFromStorage.and.returnValue(mockUser);
    profileService.getProfile.and.returnValue(of(mockProfile));

    component.ngOnInit();

    expect(component.profileForm).toBeDefined();
    expect(component.profileForm.get('firstName')?.value).toEqual('John');
    expect(component.profileForm.get('lastName')?.value).toEqual('Doe');
    expect(component.profileForm.get('dob')?.value).toEqual(new Date('1990-01-01'));
    expect(component.profileForm.get('email')?.value).toEqual('john.doe@example.com');
    expect(component.profileForm.get('phone')?.value).toEqual('+64 12345678');
  });

  it('should enable new and confirm password when current password is entered', () => {
    userStreamService.getCurrentUserFromStorage.and.returnValue(mockUser);
    profileService.getProfile.and.returnValue(of(mockProfile));

    component.ngOnInit();
    component.profileForm.get('passwords.current')?.setValue('current123');
    component.checkCurrentPassword();

    expect(component.profileForm.get('passwords.new')?.enabled).toBeTrue();
    expect(component.profileForm.get('passwords.confirm')?.enabled).toBeTrue();
  });

  it('should disable new and confirm password when current password is empty', () => {
    userStreamService.getCurrentUserFromStorage.and.returnValue(mockUser);
    profileService.getProfile.and.returnValue(of(mockProfile));

    component.ngOnInit();
    component.profileForm.get('passwords.current')?.setValue('');
    component.checkCurrentPassword();

    expect(component.profileForm.get('passwords.new')?.disabled).toBeTrue();
    expect(component.profileForm.get('passwords.confirm')?.disabled).toBeTrue();
  });

  it('should reset password fields on cancel', () => {

    userStreamService.getCurrentUserFromStorage.and.returnValue(mockUser);
    profileService.getProfile.and.returnValue(of(mockProfile));

    component.ngOnInit();

    
    component.profileForm.get('passwords.new')?.enable();
    component.profileForm.get('passwords.confirm')?.enable();

    component.onCancelPassword();

    const passwords = component.profileForm.get('passwords');

    
    expect(passwords?.get('current')?.value).toBe('');
    expect(passwords?.get('new')?.value).toBe('');
    expect(passwords?.get('confirm')?.value).toBe('');

    
    expect(passwords?.get('new')?.disabled).toBeTrue();
    expect(passwords?.get('confirm')?.disabled).toBeTrue();
  });

  it('should call resetProfile and show snackbar on successful password update', fakeAsync(() => {
    userStreamService.getCurrentUserFromStorage.and.returnValue(mockUser);
    profileService.getProfile.and.returnValue(of(mockProfile));
    profileService.resetProfile.and.returnValue(of({ success: true, message: 'Password updated' }));

    component.ngOnInit();
    component.profileForm.get('passwords.current')?.setValue('current123');
    component.checkCurrentPassword();
    component.profileForm.get('passwords.new')?.setValue('NewPass123!');
    component.profileForm.get('passwords.confirm')?.setValue('NewPass123!');

    component.onUpdatePassword();
    tick();

    expect(profileService.resetProfile).toHaveBeenCalled();
    expect(snackbar.openSnackbarWithAction).toHaveBeenCalledWith('Password updated');
  }));

  it('should show snackbar on password update error', fakeAsync(() => {
    userStreamService.getCurrentUserFromStorage.and.returnValue(mockUser);
    profileService.getProfile.and.returnValue(of(mockProfile));
    profileService.resetProfile.and.returnValue(throwError(() => ({ error: 'Failed' })));

    component.ngOnInit();
    component.profileForm.get('passwords.current')?.setValue('current123');
    component.checkCurrentPassword();
    component.profileForm.get('passwords.new')?.setValue('NewPass123!');
    component.profileForm.get('passwords.confirm')?.setValue('NewPass123!');

    component.onUpdatePassword();
    tick();

    expect(snackbar.openSnackbarWithAction).toHaveBeenCalled();
  }));
});
