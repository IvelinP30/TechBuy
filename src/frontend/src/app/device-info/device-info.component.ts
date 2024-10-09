import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { FormattingUtil } from '../utils/formatting.util';
import { ArrayUtil } from '../utils/array.util';
import { HeaderComponent } from '../shared/header/header.component';
import { BasketService } from '../services/basket/basket.service';
import { ToolbarHeaderComponent } from '../shared/toolbar-header/toolbar-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { I18nService } from '../services/i18n/i18n.service';

@Component({
  selector: 'app-device-info',
  standalone: true,
  imports: [ MatDividerModule, MatIconModule, CommonModule, RouterModule, HeaderComponent, ToolbarHeaderComponent,TranslateModule ],
  templateUrl: './device-info.component.html',
  styleUrl: './device-info.component.scss'
})
export class DeviceInfoComponent implements OnInit {
  item: any;
  device: any;

  noDeviceImage: string = "assets/images/no_image.jpg"

  deviceName: string = '';
  deviceImage: string = '';
  deviceColorName: string = '';
  deviceColorCode: string = '';
  devicePrice: number = 0;
  deviceStorage: string = '';
  deviceSize: string = '';
  deviceAvailability: string = '';

  selectedColor: { colorCode: string; colorName: string } = { colorCode: '', colorName: '' };
  selectedStorage: { value: string; price: number } = { value: '', price: 0 };
  selectedSize: { value: string, price: number } = { value: '', price: 0 };
  selectedDevice: any;

  deviceSizes: any[] = [];
  deviceColors: any[] = [];
  deviceStorageOptions: any[] = [];

  allItemStorages: any[] = [];
  allItemSizes: any[] = []

  storageAvailabilityMap: Map<string, boolean> = new Map();
  sizeAvailabilityMap: Map<string, boolean> = new Map();

  selectedItemsCount: number = 0;
  isAddedToBasket: boolean = false;

  smallScreenSideNav: boolean = window.innerWidth < 900;

  private state: { device: string, item: string } | null = null;

  constructor(private router: Router, private basketService: BasketService, private i18nService: I18nService) {
    this.router.events.subscribe(() => {
        const navigation = this.router.getCurrentNavigation();
        this.state = navigation?.extras.state as { device: string, item: string };
    });
  }
  
  ngOnInit(): void {
    this.initializeComponent();
  }

  private initializeComponent(): void {
    if (this.state) {
      this.parseState();
      this.loadDeviceData();
    } else {
      console.error('No state data found');
    }
  }

  private parseState(): void {
    try {
      this.item = JSON.parse(this.state!.item);
      this.device = this.item.device[0];
      this.selectedDevice = this.device;
    } catch (error) {
      console.error('Failed to parse device or item from state:', error);
    }
  }

  private loadDeviceData(): void {
    this.deviceName = this.device.element?.name;
    this.deviceImage = ArrayUtil.getPropertyValue(this.device.property, 'IMAGE-URL');
    this.deviceColorName = ArrayUtil.getPropertyValue(this.device.property, 'COLOR-NAME');
    this.deviceColorCode = ArrayUtil.getPropertyValue(this.device.property, 'COLOR-HEX');
    this.deviceStorage = ArrayUtil.getPropertyValue(this.device.property, 'STORAGE');
    this.devicePrice = this.device.price[0].amount;
    this.deviceSize = ArrayUtil.getPropertyValue(this.device.property, 'SIZE');
    this.deviceAvailability = this.device.stock;

    this.selectedColor = { colorCode: this.deviceColorCode, colorName: this.deviceColorName };
    this.selectedStorage = { value: this.deviceStorage, price: this.devicePrice };
    this.selectedSize = { value: this.deviceSize, price: this.devicePrice };

    this.deviceColors = this.getDeviceColors(this.item.device);
    this.deviceStorageOptions = this.getDeviceStorages(this.item.device);
    this.deviceSizes = this.getDeviceSizes(this.item.device);
    
    this.getAllItemStorages();
    this.updateStorageAvailability();
    this.getAllItemSizes();
    this.updateSizeAvailability();

  }

  getImageUrlForColor(color: any): string {
    const colorProperty = this.device.property.find((prop: { id: string; value: any; }) => prop.id === 'COLOR' && prop.value === color.value);
    return colorProperty ? ArrayUtil.getPropertyValue(this.device.property, 'IMAGE-URL') : '';
  }

  getDeviceAvailabilityColor(availability: string): string {
    switch (availability) {
      case 'OUT_OF_STOCK':
        return '#e4e4e4';
      case 'AVAILABLE':
        return '#a0cc44';
      case 'LIMITED':
        return 'orange';
      case 'PRE_ORDER':
          return '#5e94cf';
      default:
        return '#000000';
    }
  }

  getDeviceColors(devices: any[]): any[] {
    const colors = new Map<string, any>();

    devices.forEach(device => {
      if (device.property) {
        const colorProps = device.property.reduce((acc: any, prop: any) => {
          if (prop.id === 'COLOR' || prop.id === 'COLOR-HEX' || prop.id === 'COLOR-NAME') {
            acc[prop.id] = prop.value;
          }
          return acc;
        }, {});

        if (colorProps['COLOR'] && colorProps['COLOR-HEX'] && colorProps['COLOR-NAME']) {
          colors.set(colorProps['COLOR-HEX'], {
            color: colorProps['COLOR'],
            colorCode: colorProps['COLOR-HEX'],
            colorName: colorProps['COLOR-NAME']
          });
        }
      }
    });
    return Array.from(colors.values());
  }
  getAllItemStorages(): void {
    const allStorages = new Map<string, any>();

    this.item.device.forEach((device: any) => {
      if (device.property) {
        const storageProps = device.property.find((prop: any) => prop.id === 'STORAGE');
        const storageValue = storageProps ? storageProps.value : '';

        if (storageValue) {
          const priceInfo = device.price?.find((price: any) => price.type === 'VALUE');
          allStorages.set(storageValue, {
            value: storageValue,
            price: priceInfo ? priceInfo.amount : null
          });
        }
      }
    });

    this.allItemStorages = Array.from(allStorages.values());
  }
  getAllItemSizes():void {
    const allSizes = new Map<string, any>();

    this.item.device.forEach((device: any) => {
      if (device.property) {
        const sizeProps = device.property.find((prop: any) => prop.id === 'SIZE');
        const sizeValue = sizeProps ? sizeProps.value : '';

        if (sizeValue) {
          const priceInfo = device.price?.find((price: any) => price.type === 'VALUE');
          allSizes.set(sizeValue, {
            value: sizeValue,
            price: priceInfo ? priceInfo.amount : null
          });
        }
      }
    });

    this.allItemSizes = Array.from(allSizes.values());
  }
  getDeviceStorages(devices: any[]): any[] {
    const storageOptions = new Map<string, any>();
  
    devices.forEach(device => {
      if (device.property) {
        const storageProps = device.property.reduce((acc: any, prop: any) => {
          if (prop.id === 'STORAGE') {
            acc[prop.id] = prop.value;
          }
          return acc;
        }, {});
  
        if (storageProps['STORAGE']) {
          const priceInfo = device.price?.find((price: any) => price.type === 'VALUE');
  
          storageOptions.set(storageProps['STORAGE'], {
            value: storageProps['STORAGE'],
            price: priceInfo ? priceInfo.amount : null
          });
        }
      }
    });
  
    return Array.from(storageOptions.values());
  }
  
  getDeviceSizes(devices: any[]): any[] {
    const sizeOptions = new Map<string, any>();

    devices.forEach(device => {
      if (device.property) {
        const sizeProps = device.property.find((prop: any) => prop.id === 'SIZE');
        const sizeValue = sizeProps ? sizeProps.value : '';

        if (sizeValue) {
          const priceInfo = device.price?.find((price: any) => price.type === 'VALUE');
          sizeOptions.set(sizeValue, {
            value: sizeValue,
            price: priceInfo ? priceInfo.amount : null
          });
        }
      }
    });

    return Array.from(sizeOptions.values());
  }
  
  getAvailabilityName(availablity: string): string {
    return FormattingUtil.formatString(availablity)
  }

  getStorageValueFormated(storageValue: string) {
    return FormattingUtil.extractNumericAndUnit(storageValue)
  }

  onColorChange(color: any): void {
      this.isAddedToBasket = false;

      const matchingDevice = this.item.device.find((device: any) =>
        device.property.some((prop: any) => prop.id === 'COLOR-HEX' && prop.value === color.colorCode)
      );

      if (matchingDevice) {
        this.deviceName = matchingDevice.element?.name || '';
        this.deviceImage = ArrayUtil.getPropertyValue(matchingDevice.property, 'IMAGE-URL');
        this.deviceColorName = ArrayUtil.getPropertyValue(matchingDevice.property, 'COLOR-NAME');
        this.deviceColorCode = ArrayUtil.getPropertyValue(matchingDevice.property, 'COLOR-HEX');
        this.deviceAvailability = matchingDevice.stock || '';
    
        this.selectedDevice = matchingDevice;
        this.selectedColor = {
          colorCode: this.deviceColorCode,
          colorName: this.deviceColorName
        };

        const devicesWithSameColor = this.item.device.filter((device: any) =>
          device.property.some((prop: any) => prop.id === 'COLOR-HEX' && prop.value === color.colorCode)
        );

        const storageOptions = new Map<string, any>();
        devicesWithSameColor.forEach((device: any) => {
          if (device.property) {
            const storageProps = device.property.find((prop: any) => prop.id === 'STORAGE');
            const storageValue = storageProps ? storageProps.value : '';

            if (storageValue) {
              const priceInfo = device.price?.find((price: any) => price.type === 'VALUE');
              storageOptions.set(storageValue, {
                value: storageValue,
                price: priceInfo ? priceInfo.amount : null
              });
            }
          }
        });

        const sizeOptions = new Map<string, any>();
        devicesWithSameColor.forEach((device: any) => {
          if (device.property) {
            const sizeProps = device.property.find((prop: any) => prop.id === 'SIZE');
            const sizeValue = sizeProps ? sizeProps.value : '';

            if (sizeValue) {
              const priceInfo = device.price?.find((price: any) => price.type === 'VALUE');
              sizeOptions.set(sizeValue, {
                value: sizeValue,
                price: priceInfo ? priceInfo.amount : null
              });
            }
          }
        });

        this.deviceSizes = Array.from(sizeOptions.values());
        this.deviceStorageOptions = Array.from(storageOptions.values());

        const matchingStorage = this.deviceStorageOptions.find(option => option.value === this.selectedStorage.value);
        if (matchingStorage) {
          this.selectedStorage = matchingStorage;
        } else {
          this.selectedStorage = this.deviceStorageOptions[0] || { value: '', price: 0 };
        }

        const matchingSize = this.deviceSizes.find(size => size.value === this.selectedSize.value);
        if (matchingSize) {
          this.selectedSize = matchingSize;
        } else {
          this.selectedSize = this.deviceSizes[0] || { value: '', price: 0 };
        }

      } else {
        console.error('No matching device found for the selected color.');
      }

      this.updateStorageAvailability();
      this.updateSizeAvailability();
  }

  onStorageChange(storage: any): void {
    this.isAddedToBasket = false;

    const matchingDevice = this.item.device.find((device: any) => {
      const hasColor = device.property.some((prop: any) =>
        prop.id === 'COLOR-HEX' && prop.value === this.selectedColor.colorCode
      );
      const hasStorage = device.property.some((prop: any) =>
        prop.id === 'STORAGE' && prop.value === storage.value
      );
      return hasColor && hasStorage;
    });
  
    if (matchingDevice) {
      this.deviceName = matchingDevice.element?.name || '';
      this.deviceImage = ArrayUtil.getPropertyValue(matchingDevice.property, 'IMAGE-URL');
      this.deviceColorName = ArrayUtil.getPropertyValue(matchingDevice.property, 'COLOR-NAME');
      this.deviceColorCode = ArrayUtil.getPropertyValue(matchingDevice.property, 'COLOR-HEX');
      this.devicePrice = matchingDevice.price[0]?.amount || 0;
      this.deviceStorage = ArrayUtil.getPropertyValue(matchingDevice.property, 'STORAGE');
      this.deviceAvailability = matchingDevice.stock || '';
  
      this.selectedDevice = matchingDevice;

      this.selectedColor = {
        colorCode: this.deviceColorCode,
        colorName: this.deviceColorName
      };
  
      this.selectedStorage = {
        value: this.deviceStorage,
        price: this.devicePrice
      };
    } else {
      console.warn('No device found with the selected color and storage option.');
    }
  }
  onSizeChange(size: any): void {
    this.isAddedToBasket = false;

    const matchingDevice = this.item.device.find((device: any) => {
      const hasColor = device.property.some((prop: any) =>
        prop.id === 'COLOR-HEX' && prop.value === this.selectedColor.colorCode
      );
      const hasStorage = device.property.some((prop: any) =>
        prop.id === 'SIZE' && prop.value === size.value
      );
      return hasColor && hasStorage;
    });
  
    if (matchingDevice) {
      this.deviceName = matchingDevice.element?.name || '';
      this.deviceImage = ArrayUtil.getPropertyValue(matchingDevice.property, 'IMAGE-URL');
      this.deviceColorName = ArrayUtil.getPropertyValue(matchingDevice.property, 'COLOR-NAME');
      this.deviceColorCode = ArrayUtil.getPropertyValue(matchingDevice.property, 'COLOR-HEX');
      this.devicePrice = matchingDevice.price[0]?.amount || 0;
      this.deviceSize = ArrayUtil.getPropertyValue(matchingDevice.property, 'SIZE');
      this.deviceAvailability = matchingDevice.stock || '';
  
      this.selectedDevice = matchingDevice;

      this.selectedColor = {
        colorCode: this.deviceColorCode,
        colorName: this.deviceColorName
      };
  
      this.selectedSize = {
        value: this.deviceSize,
        price: this.devicePrice
      };

      this.updateStorageAvailability()

    } else {
      console.warn('No device found with the selected color and storage option.');
    }
  }

  updateStorageAvailability(): void {
    const availabilityMap = new Map<string, boolean>();
    let firstAvailableStorage: { value: string; price: number } | null = null;

    const devicesWithSelectedColor = this.item.device.filter((device: any) =>
      device.property.some((prop: any) => prop.id === 'COLOR-HEX' && prop.value === this.selectedColor.colorCode)
    );

    devicesWithSelectedColor.forEach((device: any) => {
      if (device.property) {
        const storageProps = device.property.find((prop: any) => prop.id === 'STORAGE');
        const storageValue = storageProps ? storageProps.value : '';
        const sizeProps = device.property.find((prop: any) => prop.id === 'SIZE')
        const sizeValue = sizeProps ? sizeProps.value : '';

        if (storageValue && sizeValue === this.selectedSize.value) {
            availabilityMap.set(storageValue, true);

            if (!firstAvailableStorage) {
                const priceInfo = device.price?.find((price: any) => price.type === 'VALUE');
                firstAvailableStorage = { value: storageValue, price: priceInfo ? priceInfo.amount : 0 };
            }
        }
      }
    });

    this.storageAvailabilityMap.clear();
    this.allItemStorages.forEach(storageOption => {
      const isAvailable = availabilityMap.has(storageOption.value);
      this.storageAvailabilityMap.set(storageOption.value, isAvailable);
    });

    if (!this.isStorageAvailable(this.selectedStorage.value) && firstAvailableStorage) {
        this.selectedStorage = firstAvailableStorage;
    }
  }

updateSizeAvailability(): void {
    const availabilityMap = new Map<string, boolean>();

    const devicesWithSelectedColor = this.item.device.filter((device: any) =>
        device.property.some((prop: any) => prop.id === 'COLOR-HEX' && prop.value === this.selectedColor.colorCode)
    );

    devicesWithSelectedColor.forEach((device: any) => {
        if (device.property) {
            const sizeProps = device.property.find((prop: any) => prop.id === 'SIZE');
            const sizeValue = sizeProps ? sizeProps.value : '';

            if (sizeValue) {
              availabilityMap.set(sizeValue, true);
            }
        }
    });

    this.sizeAvailabilityMap.clear();
    this.allItemSizes.forEach(sizeOption => {
        const isAvailable = availabilityMap.has(sizeOption.value);
        this.sizeAvailabilityMap.set(sizeOption.value, isAvailable);
    });
}

  areAllSelectedColorDevicesOutOfStock(colorCode: string): boolean {
    const devicesWithSelectedColor = this.item.device.filter((device: any) =>
      device.property.some((prop: any) => prop.id === 'COLOR-HEX' && prop.value === colorCode)
    );

    return devicesWithSelectedColor.every((device: any) => 
      device.stock === "OUT_OF_STOCK" || device.stock === "UNDEFINED"
    );
  }
  isStorageAvailable(storageValue: string): boolean {
    return (this.storageAvailabilityMap.get(storageValue) && this.isDeviceInStock(this.selectedDevice.stock)) || false;
  }
  isSizeAvailable(sizeValue: string): boolean {
    return (this.sizeAvailabilityMap.get(sizeValue) && this.isDeviceInStock(this.selectedDevice.stock))|| false;
  }
  isDeviceInStock(device: any):boolean {
    return device !== "OUT_OF_STOCK" && device !== "UNDEFINED"
  }
  addToBasket(item: any) {
    this.basketService.addItem(item)
    this.selectedItemsCount = this.basketService.getItemsCount()

    this.isAddedToBasket = true;

    setTimeout(() => {
        this.isAddedToBasket = false;
    }, 1000);
  }
  getButtonTextTranslate() {
    return this.i18nService.translateService.instant(
      this.isAddedToBasket ? 'in_basket' : 'add_to_basket'
    );
  }
  getAvailabilityTranslation(availability: string) {
    switch(availability) {
      case 'Pre Order':
        return this.i18nService.translateService.instant('pre_order')
      case 'Undifined':
        return this.i18nService.translateService.instant('out_of_stock')
      case 'Available':
        return this.i18nService.translateService.instant('available')
      case 'Limited':
        return this.i18nService.translateService.instant('limited')
      case 'Out Of Stock':
        return this.i18nService.translateService.instant('out_of_stock')
      }
  }
}

