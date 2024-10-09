import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private devicesApiUrl = `${environment.apiBaseUrl}/api/devices`;

  constructor(private http: HttpClient) { }

  fetchDevices(): Observable<{ group: any[] }> {
    return this.http.get<{ group: any[] }>(this.devicesApiUrl);
  }
}
