import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ReloadService } from './services/reload/reload.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { I18nService } from './services/i18n/i18n.service';
import { environment } from '../environments/environment';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
            SideNavComponent,
            MatButtonModule,
            MatIconModule,
            CommonModule,
            TranslateModule,
          ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  openSideNav: boolean | undefined = false;
  smallScreenSideNav: boolean = window.innerWidth < 900;

  constructor(private router: Router,
              private reloadService: ReloadService,
              private i18nService: I18nService) {}

  ngOnInit() {
    this.i18nService.initializeLanguage(environment.defaultLanguage, environment.supportedLanguages)
    this.reloadService.onReload();
  }

  showSideNav(): boolean {
    return this.router.url !== '/welcome';
  }

  showSmallScreenSideNavToggle(): boolean {
    return this.router.url !== '/welcome' && this.smallScreenSideNav;
  }

  toggleSideNav(): void {
    this.openSideNav = !this.openSideNav;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.smallScreenSideNav = window.innerWidth < 900;
  }

  @HostListener('window:beforeunload', ['$event'])
  handleReload(): void {
    this.reloadService.markReload();
  }
}
