import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

declare var google: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Google Sign-In </h1>

      <!-- Google Sign-In button -->
      <div id="g_id_onload"
           data-client_id="499164549963-okmqjb55lpsbpbhe4usk5bh0fhj634i6.apps.googleusercontent.com"
           data-callback="handleCredentialResponse"
           data-auto_prompt="false">
      </div>

      <div class="g_id_signin" 
           data-type="standard"
           data-size="large"
           data-theme="outline"
           data-text="signin"
           data-shape="rectangular"
           data-width="300">
      </div>

      <!-- Display user info after login -->
      <div *ngIf="userInfo" class="user-info">
        <img [src]="userInfo.picture" alt="Profile picture" width="80" height="80">
        <h3>Welcome, {{ userInfo.name }}!</h3>
        <p>Email: {{ userInfo.email }}</p>
        <button class="sign-out-button" (click)="signOut()">Sign Out</button>
      </div>
    </div>
  `,
})
export class App implements OnInit {
  userInfo: any = null;

  constructor(private cdRef: ChangeDetectorRef) {}  // Inject ChangeDetectorRef

  ngOnInit() {
    (window as any).handleCredentialResponse = (response: any) => {
      this.handleCredentialResponse(response);
    };
  }

  handleCredentialResponse(response: any) {
    // Decode JWT Token
    const decodedToken = this.parseJwt(response.credential);

    // Store user information
    this.userInfo = {
      name: decodedToken.name,
      email: decodedToken.email,
      picture: decodedToken.picture
    };

    console.log("User Info:", this.userInfo); // Debugging

    // Force Angular to detect UI changes
    this.cdRef.detectChanges();
  }

  parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }

  signOut() {
    google.accounts.id.disableAutoSelect();
    this.userInfo = null;

    // Force UI update after logout
    this.cdRef.detectChanges();
  }
}

bootstrapApplication(App);
