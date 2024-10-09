import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchValueSubject = new BehaviorSubject<string>('');
  private selectedTypeSubject = new BehaviorSubject<string | null>(null);
  private selectedBrandSubject = new BehaviorSubject<string[]>([]);

  searchValue$ = this.searchValueSubject.asObservable();
  selectedType$ = this.selectedTypeSubject.asObservable();
  selectedBrand$ = this.selectedBrandSubject.asObservable();

  setSearchValue(value: string) {
    this.searchValueSubject.next(value);
  }

  setSelectedType(type: string | null) {
    this.selectedTypeSubject.next(type);
  }

  setSelectedBrands(brands: string[]) {
    this.selectedBrandSubject.next(brands);
  }

  clearSearchValues() {
    this.setSearchValue('');
    this.setSelectedType(null);
    this.setSelectedBrands([]);
  }
}
