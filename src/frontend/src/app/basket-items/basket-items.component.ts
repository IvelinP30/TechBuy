import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';
import { ToolbarHeaderComponent } from '../shared/toolbar-header/toolbar-header.component';
import { SaleCardComponent } from '../sale-card/sale-card.component';
import { BasketService } from '../services/basket/basket.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { I18nService } from '../services/i18n/i18n.service';

@Component({
  selector: 'app-basket-items',
  standalone: true,
  imports: [HeaderComponent,
            CommonModule,
            ToolbarHeaderComponent,
            SaleCardComponent,
            MatStepperModule,
            MatButtonModule,
            MatStepperModule,
            FormsModule,
            ReactiveFormsModule,
            MatFormFieldModule,
            MatInputModule,
            MatIconModule,
            MatSelectModule,
            TranslateModule
  ],
  templateUrl: './basket-items.component.html',
  styleUrl: './basket-items.component.scss'
})
export class BasketItemsComponent implements OnInit{
  items: any = [];
  totalItemsPrice: number = 0;
  smallScreenSideNav: boolean = window.innerWidth < 900;
  orderDone: boolean= false;

  orderDetails = {
    fullName: '',
    shippingAddress: '',
    paymentMethod: '',
    phoneNumber: '',
  };

  constructor(private basketService: BasketService, private router: Router, private i18nService: I18nService) {}

  ngOnInit(): void {
    this.items = this.basketService.getItems()
    this.totalItemsPrice = this.items
        .map((item: { price: any; }) => item.price.map((price: { amount: any; }) => price.amount))
        .flat()
        .reduce((total: number, amount: number) => total + amount, 0); 
  }
  
  getHeaderName(stepper: MatStepper): string {
    return this.i18nService.translateService.instant(
      stepper.selectedIndex === 0 ? 'items_in_basket' : 'order_details'
    );
  }
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.smallScreenSideNav = window.innerWidth < 900;
  }

  removeItem(item: any) {
    this.basketService.removeItem(item);
    this.updateTotalPrice();
  }

  updateTotalPrice() {
    this.items = this.basketService.getItems()
    this.totalItemsPrice = this.items.reduce((total: number, item: { price: any[] }) => {
      const itemTotal = item.price.reduce((itemSum: number, price: { amount: number }) => itemSum + price.amount, 0);
      return total + itemTotal;
    }, 0);  
  }

  back(stepper: MatStepper) {
    if (stepper.selectedIndex === 0) {
      this.router.navigate(['/devices-list'])
    } else {
      stepper.previous();
    }
  }

  continue(stepper: MatStepper) {
    if (this.isLastStep(stepper)) {
      this.onSubmit()
      this.basketService.clearBasket()
    } else {
      stepper.next();
    }
  }

  isLastStep(stepper: MatStepper): boolean {
    return stepper.selectedIndex === stepper.steps.length - 1;
  }

  correctOrderDetails() {
    if(this.orderDetails.fullName && this.orderDetails.paymentMethod && this.orderDetails.shippingAddress && this.orderDetails.phoneNumber) {
      return true
    }
    return false;
  }

  onSubmit(): void {
    if (this.correctOrderDetails()) {
        this.orderDone = true;
    }
  }
  
  returnAfterOrder() {
    this.orderDone = false;
    this.router.navigate(['/devices-list']);
  }
}
