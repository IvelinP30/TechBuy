import { Component, HostListener, Input } from '@angular/core';
import { I18nService, Language } from '../../services/i18n/i18n.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { BasketService } from '../../services/basket/basket.service';

@Component({
  selector: 'app-toolbar-header',
  standalone: true,
  imports: [MatMenuModule, MatIconModule, MatButtonModule, CommonModule, MatBadgeModule],
  templateUrl: './toolbar-header.component.html',
  styleUrl: './toolbar-header.component.scss'
})
export class ToolbarHeaderComponent {
  @Input() inBasket?: boolean | undefined;
  
  darkModeEnabled: boolean = false;
  smallScreenSideNav: boolean = window.innerWidth < 900;
  isSelectedItemsovered: boolean = false;

  constructor(private i18nService: I18nService,
              private router: Router,
              private basketSerivce: BasketService
  ){}

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.smallScreenSideNav = window.innerWidth < 900;
  }
  
  get basketItemsCount(): any {
    return this.basketSerivce.getItemsCount()
  }

  get currentLanguage(): Language {
    return this.i18nService.currentLanguage
  }

  get languages(): Language[] {
    return this.i18nService.supportedLanguages
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }
  toggleTheme() {
    this.darkModeEnabled = !this.darkModeEnabled;
    if (this.darkModeEnabled) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
  
  get selectedItems() {
    return this.basketSerivce.getItems
  }

  showSelectedItems() {
    this.router.navigate(['/basket-items']);
  }

  onisSelectedItemsMouseEnter(): void {
    this.isSelectedItemsovered = true;
  }

  onisSelectedItemsMouseLeave(): void {
    this.isSelectedItemsovered = false;
  }
}
