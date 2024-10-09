import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from "./auth";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenUrl = `${environment.apiBaseUrl}/api/oauth2/token`;

  constructor(private http: HttpClient, private cookieService: CookieService,) { }

  getTokenInfo(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(this.tokenUrl);
  }

  isAuthenticated(): boolean {
    const token = this.cookieService.get('accessToken');
    return !!token;
  }

  logout() {
    localStorage.removeItem('access_token');
    // Redirect to login page or logout endpoint
  }
}
