import { Injectable } from '@angular/core';
import { UserTypes } from '../DTO/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {
  private roleSubject = new BehaviorSubject<UserTypes | null>(null);
  role$ = this.roleSubject.asObservable();

  setRole(role: UserTypes) {
    this.roleSubject.next(role);
  }

  getRole(): UserTypes | null {
    return this.roleSubject.value;
  }
}



