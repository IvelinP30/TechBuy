import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { I18nService } from '../services/i18n/i18n.service';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [ RouterModule, ConfirmationDialogComponent, CommonModule, TranslateModule ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {
  readonly dialog = inject(MatDialog);

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private i18nService: I18nService
  ) {}

  onLogout() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogIcon: 'logout',
        dialogTitle: this.i18nService.translateService.instant('logout'),
        dialogText: this.i18nService.translateService.instant('are_sure_logout'),
        button1Text: this.i18nService.translateService.instant('cancel'),
        button2Text: this.i18nService.translateService.instant('logout'),
        dialogColor: '#434c81'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.logout();
      }
    });
  }

  logout() {
    console.log('logout')
    localStorage.removeItem('access_token');
    this.cookieService.deleteAll();
    const baseUrl = window.location.origin; // Get the base URL of the current site

    // Redirect to the logout URL
    window.location.href = `${baseUrl}/oauth/logout`;
  }

  reload() {
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
  }
}
