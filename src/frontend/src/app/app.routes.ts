import { Routes } from '@angular/router';
import { DevicesListComponent } from './devices-list/devices-list.component';
import { HomeComponent } from './home/home.component';
import { DeviceInfoComponent } from './device-info/device-info.component';
import { authGuard } from "./auth/auth.guard";
import { WelcomeComponent } from "./welcome/welcome.component";
import { BasketItemsComponent } from './basket-items/basket-items.component';

export const routes: Routes = [
    { path: '', redirectTo: '/welcome', pathMatch: 'full' },
    { path: 'welcome', component: WelcomeComponent, title: 'Welcome' },
    { path: 'home', component: HomeComponent, title: 'Home', canActivate: [authGuard] },
    { path: 'devices-list/:name', component: DeviceInfoComponent, title: 'Device', canActivate: [authGuard] },
    { path: 'devices-list', component: DevicesListComponent, title: 'Devices', canActivate: [authGuard] },
    { path: 'basket-items', component: BasketItemsComponent, title: 'Basket', canActivate: [authGuard] },
];
