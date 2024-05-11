import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrl: './login-status.component.css'
})
export class LoginStatusComponent implements OnInit {

isAuthenticated: boolean =false;
userFullName: string = '';

storage: Storage = sessionStorage;
constructor(
  private oktaAuthService: OktaAuthStateService,
  @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
) {}

  ngOnInit(): void {
    //Subscribe to authentication state changes

    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated;
        this.getUserDetails();
      }
    )
  }
  getUserDetails() {
    if(this.isAuthenticated) {
      // Fetch the Logged in user details(user's claims)

      //user full name exposed as property name
      this.oktaAuth.getUser().then(
        (res) => {
          this.userFullName =  res.name as string;

          //retrieve the user's email from the authentication reponse
          const theEmail = res.email;

          //now store the email in the browser storage
          this.storage.setItem('theEmail', JSON.stringify(theEmail));
        }
      )
    }
  }

  logOut() {
    //Teminate the session with Okta & removes current tokens

    this.oktaAuth.signOut();
  }

}
