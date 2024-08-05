import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { BinanceService } from "../../core/binance.service";
import { FilterDialogComponent } from "../filter-dialog/filter-dialog.component";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Subscription, interval } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { FilterService } from "src/app/core/filter.service";

@Component({
 selector: "app-stock-screener",
 templateUrl: "./stock-screener.component.html",
 styleUrls: ["./stock-screener.component.scss"],
})
export class StockScreenerComponent implements OnInit, OnDestroy {
 displayedColumns: string[] = [
  "stars",
  "symbol",
  "price",
  "volume",
  "priceChange",
  "quoteVolume",
  "bidPrice",
  "askPrice",
 ];
 dataSource = new MatTableDataSource<any>([]);
 cryptos: any[] = [];
 filteredCryptos: any[] = [];
 isLoading = true;

 minVolume: number | null = null;
 maxVolume: number | null = null;
 minPriceChange: number | null = null;
 maxPriceChange: number | null = null;
 minPrice: number | null = null;
 maxPrice: number | null = null;

 @ViewChild(MatPaginator) paginator!: MatPaginator;
 @ViewChild(MatSort) sort!: MatSort;

 private subscription!: Subscription;

 constructor(private binanceService: BinanceService, public dialog: MatDialog, private filterService: FilterService) {}

 ngOnInit(): void {
  this.subscription = interval(10000)
   .pipe(
    switchMap(() => this.binanceService.getCryptos()),
    tap(() => (this.isLoading = true)),
    tap((data) => {
     this.cryptos = data.filter((crypto) => crypto.symbol.endsWith("USDT"));
     this.applyFilters();
    }),
    tap(() => (this.isLoading = false))
   )
   .subscribe();
 }

 applyFilters(filters?: any): void {
  this.filteredCryptos = this.cryptos;

  if (filters) {
   if (filters.minVolume !== null) {
    this.filteredCryptos = this.filteredCryptos.filter((crypto) => parseFloat(crypto.volume) >= filters.minVolume);
   }
   if (filters.maxVolume !== null) {
    this.filteredCryptos = this.filteredCryptos.filter((crypto) => parseFloat(crypto.volume) <= filters.maxVolume);
   }
   if (filters.minPriceChange !== null) {
    this.filteredCryptos = this.filteredCryptos.filter(
     (crypto) => parseFloat(crypto.priceChangePercent) >= filters.minPriceChange
    );
   }
   if (filters.maxPriceChange !== null) {
    this.filteredCryptos = this.filteredCryptos.filter(
     (crypto) => parseFloat(crypto.priceChangePercent) <= filters.maxPriceChange
    );
   }
   if (filters.minPrice !== null) {
    this.filteredCryptos = this.filteredCryptos.filter((crypto) => parseFloat(crypto.lastPrice) >= filters.minPrice);
   }
   if (filters.maxPrice !== null) {
    this.filteredCryptos = this.filteredCryptos.filter((crypto) => parseFloat(crypto.lastPrice) <= filters.maxPrice);
   }
  }

  this.dataSource.data = this.filteredCryptos;
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
 }

 openFilterDialog(): void {
  this.isLoading = false;
  const dialogRef = this.dialog.open(FilterDialogComponent, {
   width: "500px",
   data: {
    minVolume: this.minVolume,
    maxVolume: this.maxVolume,
    minPriceChange: this.minPriceChange,
    maxPriceChange: this.maxPriceChange,
    minPrice: this.minPrice,
    maxPrice: this.maxPrice,
   },
  });

  dialogRef.afterClosed().subscribe((result) => {
   if (result) {
    this.minVolume = result.minVolume;
    this.maxVolume = result.maxVolume;
    this.minPriceChange = result.minPriceChange;
    this.maxPriceChange = result.maxPriceChange;
    this.minPrice = result.minPrice;
    this.maxPrice = result.maxPrice;
    this.applyFilters(result);
   }
  });
 }

 resetFilters(): void {
  this.filterService.resetFilters();
 }

 ngOnDestroy(): void {
  if (this.subscription) {
   this.subscription.unsubscribe();
  }
 }
}
