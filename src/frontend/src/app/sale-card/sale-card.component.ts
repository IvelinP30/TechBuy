import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-sale-card',
  standalone: true,
  imports: [MatCardModule, MatDividerModule, MatIconModule, MatButtonModule, CommonModule, TranslateModule],
  templateUrl: './sale-card.component.html',
  styleUrl: './sale-card.component.scss'
})
export class SaleCardComponent implements OnInit {
  @Input() item: any | undefined;
  @Input() inBasket?: boolean | undefined;
  @Output() viewDevice = new EventEmitter<any>();
  @Output() removeItem = new EventEmitter<any>();

  noDeviceImg: string = "assets/images/no_image.jpg"
  itemPrice: number = 0;
  itemImageProperty: any = '';
  ngOnInit(): void {
    if(!this.inBasket){
      const device = this.item.device[0];
      this.itemPrice = device.price[0].amount;
      this.itemImageProperty = device.property
    } else {
      this.itemPrice = this.item.price[0].amount;
      this.itemImageProperty = this.item.property
    }

  }

  onViewDevice() {
    this.viewDevice.emit();
  }

  getImageUrl(properties: { id: string; value: string }[]): string {
    const imageUrlProperty = properties.find(prop => prop.id === 'IMAGE-URL');
    return imageUrlProperty ? imageUrlProperty.value : this.noDeviceImg;
  }

  onRemoveItem(item: any) {
    this.removeItem.emit();
  }
}
