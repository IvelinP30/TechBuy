import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SaleCardComponent } from '../sale-card/sale-card.component';
import { DataService } from '../services/data/data.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ArrayUtil } from '../utils/array.util';
import { FormattingUtil } from '../utils/formatting.util';
import { Observable, startWith, map, of } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { SearchService } from '../services/search/search.service';
import { ToolbarHeaderComponent } from '../shared/toolbar-header/toolbar-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { I18nService } from '../services/i18n/i18n.service';

@Component({
  selector: 'app-devices-list',
  standalone: true,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    SaleCardComponent,
    MatDividerModule,
    HeaderComponent,
    FormsModule,
    ToolbarHeaderComponent,
    TranslateModule
  ],
  templateUrl: './devices-list.component.html',
  styleUrl: './devices-list.component.scss'
})
export class DevicesListComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;

  searchModelControl = new FormControl<string>('');
  brandControl = new FormControl<string[]>([]);
  selectedType: string | null = null;
  selectOpen = false;
  inputSelected = false;
  devices: any[] = [];
  allDeviceTypes: any[] = [];
  deviceTypes: any[] = [];
  sortedDeviceTypes: any[] = [];
  deviceNames: any[] = [];
  availableBrands: any[] = [];
  loading: boolean = false;
  filteredOptions: Observable<string[]> = of([]);
  filterValue: string = '';
  saleItems: any[] = [];
  filteredSaleItems: any[] = [];
  selectedItemsCount: number = 0;
  selectedItems: any;

  brandSearch: string = '';
  filteredBrands: string[] = [];

  constructor(private dataService: DataService,
              private router: Router,
              private searchService: SearchService,
              private i18nService: I18nService) {}

  ngOnInit(): void {
    this.searchService.searchValue$.subscribe(value => {
      this.searchModelControl.setValue(value);
    });

    this.searchService.selectedType$.subscribe(type => {
      this.selectedType = type;
    });

    this.searchService.selectedBrand$.subscribe(brands => {
      this.brandControl.setValue(brands);
    });

    this.getDevices();

    this.filteredOptions = this.searchModelControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterDevices(value || '')),
    );
  }

  private filterDevices(value: string): string[] {
    return ArrayUtil.filter(this.deviceNames, value);
  }

  getDevices(): void {
    this.loading = true;
    this.dataService.fetchDevices().subscribe({
      next: (response) => {
        this.devices = response.group.flatMap(item => item.device);
        this.loading = false;
        const allTypes = response.group.flatMap(item => item.type);
        this.deviceTypes = ArrayUtil.removeDuplicates(allTypes)
        .map((type: any) => FormattingUtil.formatString(type));
        this.sortedDeviceTypes = this.deviceTypes.sort((a, b) => {
          const order = ['Handset', 'Tablet', 'Laptop', 'Accessory', 'Smart Watch', 'Mobile Internet'];
          return order.indexOf(a) - order.indexOf(b);
        });
        this.deviceNames = response.group.flatMap(item => item.element.name)
        const allBrands = response.group.flatMap(item => item.category);
        this.availableBrands = ArrayUtil.removeDuplicates(allBrands);
        this.filteredBrands = this.availableBrands;
        this.saleItems = response.group.reverse();
        this.filteredSaleItems = this.saleItems;

        this.filterSaleItems();
        this.filterSearchAutocompleteOptions();
      },
      error: (error) => {
        console.error('There was an error fetching device list!', error);
        this.loading = false;
      },
    });
  }


  onSelectFocus() {
    this.selectOpen = true;
  }

  onSelectClose() {
    this.selectOpen = false;
  }

  onInputFocus() {
    this.inputSelected = true;
  }

  onInputBlur() {
    this.inputSelected = false;
  }

  filterBrands(): void {
    console.log(this.brandControl.value)
    const search = this.brandSearch.toLowerCase();
    this.filteredBrands = this.availableBrands.filter(brand =>
      brand.toLowerCase().includes(search)
    );

    const selectedBrands: string[] = this.brandControl.value || [];
    this.filteredBrands = Array.from(new Set([...this.filteredBrands, ...selectedBrands]));
  }

  onBrandSelect(): void {
    this.filterSaleItems();
  }
  private filterItemsBySearch(searchValue: string, selectedBrands: string[], selectedType: string | null) {
    const searchTokens = searchValue
      .toLowerCase()
      .split(/\s+/)
      .filter(token => token !== '');
  
    return this.saleItems.filter(item => {
      const matchesType = selectedType
        ? item.type.includes(FormattingUtil.undoFormatString(selectedType))
        : true;
  
      const matchesBrands = selectedBrands.length
        ? selectedBrands.includes(item.category)
        : true;
  
      const matchesSearch = searchTokens.length
        ? searchTokens.every(token =>
            item.element.name.toLowerCase().includes(token)
          )
        : true;
  
      return matchesType && matchesBrands && matchesSearch;
    });
  }
  
  filterSaleItems(): void {
    const searchValue = this.searchModelControl.value || '';
    const selectedBrands: string[] = this.brandControl.value || [];
  
    this.filteredSaleItems = this.filterItemsBySearch(searchValue, selectedBrands, this.selectedType);
  
    this.searchService.setSearchValue(searchValue);
    this.searchService.setSelectedType(this.selectedType);
    this.searchService.setSelectedBrands(selectedBrands);
  }

  filterSearchAutocompleteOptions(): void {
    this.filteredOptions = this.searchModelControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const searchValue = (value || '').trim();
        const selectedBrands: string[] = this.brandControl.value || [];
  
        const filteredItems = this.filterItemsBySearch(searchValue, selectedBrands, this.selectedType);
  
        const filteredNames = filteredItems.map(item => item.element.name);
  
        return filteredNames.slice(0, 10);
      })
    );
  }

  onDeviceTypeSelect (): void {
    this.filterSaleItems()
    this.filterSearchAutocompleteOptions()
  }

  viewDevice(item: any) {
    const serializedItem = JSON.stringify(item);
    this.router.navigate(['/devices-list/', item.element.name], { state: {item: serializedItem } });
  }

  closeAutocompletePanel() {
    if (this.autocompleteTrigger) {
      this.autocompleteTrigger.closePanel();
    }
  }

  clearSearchModelInput(): void {
    this.searchModelControl.setValue('');
    this.filterSaleItems();
  }

  clearSearchBrandInput(): void {
    this.brandSearch = ''
    this.filterBrands();
  }

  clearSelectBrandInput(): void {
    this.brandControl.setValue([]);
    this.filterSaleItems();
  }

  onOptionSelected(event: any): void {
    const selectedOption = event.option.value;
    this.searchModelControl.setValue(selectedOption);
    this.filterSaleItems();
    this.closeAutocompletePanel();
  }
  getTypeTranslation(type: string) {
    switch(type) {
      case 'Handset':
        return this.i18nService.translateService.instant('handset')
      case 'Tablet':
        return this.i18nService.translateService.instant('tablet')
      case 'Laptop':
        return this.i18nService.translateService.instant('laptop')
      case 'Accessory':
        return this.i18nService.translateService.instant('accessory')
      case 'Smart Watch':
        return this.i18nService.translateService.instant('smart_watch')
      case 'Mobile Internet':
        return this.i18nService.translateService.instant('mobile_internet')
      }
  }

  getHeaderName(): string {
    return this.selectedType ? this.getTypeTranslation(this.selectedType) 
                              : this.i18nService.translateService.instant('devices')
  }
}
