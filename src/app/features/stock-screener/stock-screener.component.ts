import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { BinanceWebSocketService } from "../../core/binancewebsocket.service";
import { FilterDialogComponent } from "../filter-dialog/filter-dialog.component";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { FilterService } from "src/app/core/filter.service";
import { Subscription } from "rxjs";

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
  tempCryptos: any[] = [];
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

  private shouldUpdate = true;
  private filterSubscription!: Subscription;

  constructor(
    private binanceWebSocketService: BinanceWebSocketService,
    public dialog: MatDialog,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.filterSubscription = this.filterService.filters$.subscribe((filters) => {
      if (filters) {
        this.clearFilters()
      }
    });
    this.binanceWebSocketService.messageHandler = (data) => {
      this.isLoading = true;
      if (this.shouldUpdate && data) {
        this.tempCryptos = data.filter((crypto: any) => crypto.s.endsWith("USDT"));
        this.setMinMaxValues();
        this.applyFilters();
      }
      this.isLoading = false;
    };
  }

  applyFilters(filters?: any): void {
    this.filteredCryptos = this.tempCryptos;

    if (filters) {
      if (filters.minVolume !== null) {
        this.filteredCryptos = this.filteredCryptos.filter((crypto) => parseFloat(crypto.v) >= filters.minVolume);
      }
      if (filters.maxVolume !== null) {
        this.filteredCryptos = this.filteredCryptos.filter((crypto) => parseFloat(crypto.v) <= filters.maxVolume);
      }
      if (filters.minPriceChange !== null) {
        this.filteredCryptos = this.filteredCryptos.filter(
          (crypto) => parseFloat(crypto.P) >= filters.minPriceChange
        );
      }
      if (filters.maxPriceChange !== null) {
        this.filteredCryptos = this.filteredCryptos.filter(
          (crypto) => parseFloat(crypto.P) <= filters.maxPriceChange
        );
      }
      if (filters.minPrice !== null) {
        this.filteredCryptos = this.filteredCryptos.filter((crypto) => parseFloat(crypto.c) >= filters.minPrice);
      }
      if (filters.maxPrice !== null) {
        this.filteredCryptos = this.filteredCryptos.filter((crypto) => parseFloat(crypto.c) <= filters.maxPrice);
      }
    }

    this.dataSource.data = this.filteredCryptos;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  setMinMaxValues() {
    if (this.tempCryptos.length > 0) {
      const prices = this.tempCryptos.map((crypto) => parseFloat(crypto.c));
      const volumes = this.tempCryptos.map((crypto) => parseFloat(crypto.v));
      const priceChanges = this.tempCryptos.map((crypto) => parseFloat(crypto.P));

      this.minPrice = Math.min(...prices);
      this.maxPrice = Math.max(...prices);
      this.minVolume = Math.min(...volumes);
      this.maxVolume = Math.max(...volumes);
      this.minPriceChange = Math.min(...priceChanges);
      this.maxPriceChange = Math.max(...priceChanges);
    }
  }

  openFilterDialog(): void {
    this.isLoading = false;
    this.shouldUpdate = false;

    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: "500px",
      data: {
        minVolume: this.minVolume,
        maxVolume: this.maxVolume,
        minPriceChange: this.minPriceChange,
        maxPriceChange: this.maxPriceChange,
        minPrice: this.minPrice,
        maxPrice: this.maxPrice,
        onCancel: () => this.shouldUpdate = true
      },
    });

    dialogRef.afterClosed().subscribe((result) => {

      if (result) {
        this.shouldUpdate = false;
        this.minVolume = result.minVolume;
        this.maxVolume = result.maxVolume;
        this.minPriceChange = result.minPriceChange;
        this.maxPriceChange = result.maxPriceChange;
        this.minPrice = result.minPrice;
        this.maxPrice = result.maxPrice;
        this.applyFilters(result);
      } else {
        this.shouldUpdate = true;
      }
    });
  }

  clearFilters(): void {
    this.shouldUpdate = true;
    this.minVolume = null;
    this.maxVolume = null;
    this.minPriceChange = null;
    this.maxPriceChange = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.applyFilters();
  }

  resetFilters(): void {
    this.filterService.resetFilters();
  }

  ngOnDestroy(): void {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
    this.binanceWebSocketService.messageHandler = () => {};
  }
}
