import { Component, OnInit } from '@angular/core';
import { UserTypes } from '../../shared/DTO/user';
import { Router } from '@angular/router';

@Component({
  selector: 'emh-landing-page',
  imports: [],
  templateUrl: './emh-landing-page.html',
  styleUrl: './emh-landing-page.less'
})
export class EmhLandingPage implements OnInit {

  userTypes = UserTypes;

  constructor(private router: Router) { }

  ngOnInit(): void { }

  /**
 * Navigate the user to a specific route based on their selected role.
 * @param role - The role selected by the user (Doctor, Patient, Pharmacist)
 */
  loginAs(role: UserTypes) {
    const path = 'login';
    if (role === UserTypes.DOCTOR) {
      this.router.navigate([`/doctor/${path}`]);
    } else if (role === UserTypes.PATIENT) {
      this.router.navigate([`/patient/${path}`]);
    } else if (role === UserTypes.PHARMACY) {
      this.router.navigate([`/pharmacist/${path}`]);
    } else {
      this.router.navigate(['/']);
    }
  }
}

