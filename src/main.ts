import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

declare var google: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="outer-frame">
      <!-- User Menu (Visible after login) -->
      <div *ngIf="userInfo" class="user-menu">
        <img [src]="userInfo.picture" alt="Profile Picture" class="profile-pic">
        <span class="user-name">{{ userInfo.name }}</span>
        <button class="logout-btn" (click)="signOut()">Logout</button>
      </div>

      <div class="container">
        <h1>Google Sign-In </h1>

        <!-- Google Sign-In button -->
        <div id="g_id_onload"
             data-client_id="8117121138-q48farvuenq4nmjn9b27j9i6cda32rg0.apps.googleusercontent.com"
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
    </div>
  `,
  styles: [`
    .outer-frame {
      position: relative;
      text-align: center;
      font-family: Arial, sans-serif;
    }
    
    .user-menu {
  position: fixed; /* Fix to top-right */
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  padding: 10px 15px;
  border-radius: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  z-index: 1000; /* Ensures it's above other elements */
}


    
    .profile-pic {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    
    .user-name {
      font-size: 14px;
      font-weight: bold;
    }
    
    .logout-btn {
      background: red;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 10px;
      cursor: pointer;
    }
    
    .container {
      margin-top: 50px;
    }

    .sign-out-button {
      margin-top: 10px;
      background-color: red;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 5px;
      cursor: pointer;
    }
  `]
})
export class App implements OnInit {
  userInfo: any = null;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    (window as any).handleCredentialResponse = (response: any) => {
      this.handleCredentialResponse(response);
    };
  }

  handleCredentialResponse(response: any) {
    const decodedToken = this.parseJwt(response.credential);
    this.userInfo = {
      name: decodedToken.name,
      email: decodedToken.email,
      picture: decodedToken.picture
    };

    console.log("User Info:", this.userInfo);
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
    this.cdRef.detectChanges();
  }
}

bootstrapApplication(App);
