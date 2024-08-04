import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BinanceService } from '../binance.service';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';

@Component({
  selector: 'app-stock-screener',
  templateUrl: './stock-screener.component.html',
  styleUrls: ['./stock-screener.component.css']
})
export class StockScreenerComponent implements OnInit {
  displayedColumns: string[] = ['symbol', 'price', 'volume', 'priceChange'];
  cryptos: any[] = [];
  filteredCryptos: any[] = [];

  constructor(private binanceService: BinanceService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchCryptos();
    setInterval(() => this.fetchCryptos(), 10000); // Update prices every 10 seconds
  }

  fetchCryptos(): void {
    this.binanceService.getCryptos().subscribe(data => {
      this.cryptos = data.filter(crypto => crypto.symbol.endsWith('USDT'));
      this.applyFilters();
    });
  }

  applyFilters(filters?: any): void {
    // Implement filtering logic based on filters
    this.filteredCryptos = this.cryptos; // Replace with actual filtering logic
  }

  openFilterDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '250px',
      data: {} // Pass current filters if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.applyFilters(result);
      }
    });
  }

  onRowClick(row: any): void {
    // Handle row click for optional chart display
  }
}
