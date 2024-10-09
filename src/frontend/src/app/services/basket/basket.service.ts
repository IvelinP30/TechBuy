import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  private items: any[] = [];

  constructor() { }

  addItem(item: any): void {
    this.items.push(item);
  }

  getItemsCount(): number {
    return this.items.length;
  }

  getItems(): any[] {
    return this.items;
  }

  removeItem(item: any): void {
    const index = this.items.findIndex(i => i === item);
    if (index !== -1) {
      this.items.splice(index, 1);
    } 
  }

  clearBasket(): void {
    this.items = [];
  }
}
