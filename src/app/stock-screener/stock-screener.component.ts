import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BinanceService } from '../binance.service';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { PriceChartComponent } from '../price-chart/price-chart.component';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-stock-screener',
  templateUrl: './stock-screener.component.html',
  styleUrls: ['./stock-screener.component.scss']
})
export class StockScreenerComponent implements OnInit {
  displayedColumns: string[] = ['stars', 'number', 'symbol', 'price', 'volume', 'priceChange', 'quoteVolume', 'bidPrice', 'askPrice'];
  dataSource = new MatTableDataSource<any>([]);
  cryptos: any[] = [];
  filteredCryptos: any[] = [];
  searchControl = new FormControl('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private binanceService: BinanceService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchCryptos();
    setInterval(() => this.fetchCryptos(), 10000);
  }

  fetchCryptos(): void {
    this.binanceService.getCryptos().subscribe(data => {
      this.cryptos = data.filter(crypto => crypto.symbol.endsWith('USDT'));
      this.applyFilters();
    });
  }

  applyFilters(filters?: any): void {
    this.filteredCryptos = this.cryptos;

    if (filters) {
      if (filters.minVolume) {
        this.filteredCryptos = this.filteredCryptos.filter(crypto => parseFloat(crypto.volume) >= filters.minVolume);
      }
      if (filters.maxVolume) {
        this.filteredCryptos = this.filteredCryptos.filter(crypto => parseFloat(crypto.volume) <= filters.maxVolume);
      }
      if (filters.minPriceChange) {
        this.filteredCryptos = this.filteredCryptos.filter(crypto => parseFloat(crypto.priceChangePercent) >= filters.minPriceChange);
      }
      if (filters.maxPriceChange) {
        this.filteredCryptos = this.filteredCryptos.filter(crypto => parseFloat(crypto.priceChangePercent) <= filters.maxPriceChange);
      }
      if (filters.minPrice) {
        this.filteredCryptos = this.filteredCryptos.filter(crypto => parseFloat(crypto.lastPrice) >= filters.minPrice);
      }
      if (filters.maxPrice) {
        this.filteredCryptos = this.filteredCryptos.filter(crypto => parseFloat(crypto.lastPrice) <= filters.maxPrice);
      }
    }

    this.dataSource.data = this.filteredCryptos;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openFilterDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.applyFilters(result);
      }
    });
  }

  onRowClick(row: any): void {
    const dialogRef = this.dialog.open(PriceChartComponent, {
      width: '80vw',
      height: '80vh',
      data: { symbol: row.symbol }
    });
  }
}
