import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from "../auth/auth.service";
import { AuthResponse } from "../auth/auth";
import { ToolbarHeaderComponent } from '../shared/toolbar-header/toolbar-header.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    RouterModule,
    ToolbarHeaderComponent,
    TranslateModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  accessToken: string = '';
  authResponse: AuthResponse =  <AuthResponse>{};
  userName: string = '';
  selectedItemsCount: number = 0;

  constructor(
    private cookieService: CookieService,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    const accessToken = this.cookieService.get('accessToken');
    console.log('access_Token', accessToken)
    this.authService.getTokenInfo().subscribe({
      next: (response) => {
        localStorage.setItem('access_token', response.accessToken);
        console.log('response.accessToken', response.accessToken);
        this.authResponse = response;
        this.userName = response.userName
      },
      error: (error) => {
        console.error('There was an error fetching device list!', error);
      },
    });
  }
}
