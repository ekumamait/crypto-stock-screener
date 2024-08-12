import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private filtersSubject = new BehaviorSubject<any>({
    symbol: '',
    price: '',
    volume: '',
    priceChange: '',
    quoteVolume: '',
    bidPrice: '',
    askPrice: ''
  });

  filters$ = this.filtersSubject.asObservable();

  setFilters(filters: any): void {
    this.filtersSubject.next(filters);
  }

  resetFilters(): void {
    this.filtersSubject.next({
      symbol: '',
      price: '',
      volume: '',
      priceChange: '',
      quoteVolume: '',
      bidPrice: '',
      askPrice: ''
    });
    console.log('>>>>>>');
    
  }
}
