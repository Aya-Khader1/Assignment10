import { Component, AfterViewInit } from '@angular/core';
import { Auth } from './services/auth';

declare const google: any;

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<div id="google-btn"></div>`,
})
export class AppComponent implements AfterViewInit {
  constructor(private readonly authService: Auth) {}
  ngAfterViewInit() {
    google.accounts.id.initialize({
      client_id: '157637174604-tnhhobo63r5a7532iisrbp96ad4bpshn.apps.googleusercontent.com',
      callback: async (response: any) => {
        console.log('ID TOKEN:', response.credential);
        await this.authService.googleLogin(response.credential);
        // send token to backend
      },
    });

    google.accounts.id.renderButton(document.getElementById('google-btn'), {
      theme: 'outline',
      size: 'large',
    });
  }
}

// http://127.0.0.1:4200
