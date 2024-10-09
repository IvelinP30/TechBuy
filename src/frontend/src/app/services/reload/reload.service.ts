import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ReloadService {

  constructor(private router: Router) {}

  onReload() {
    const wasReloaded = sessionStorage.getItem('reloaded');

    if (wasReloaded) {
      sessionStorage.removeItem('reloaded');

      this.router.navigate(['/home']);
    }
  }

  markReload() {
    sessionStorage.setItem('reloaded', 'true');
  }
}
