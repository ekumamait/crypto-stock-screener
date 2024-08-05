import { Component, OnInit } from "@angular/core";
import { FilterService } from "src/app/core/filter.service";

@Component({
 selector: "app-table-skeleton",
 templateUrl: "./table-skeleton.component.html",
 styleUrls: ["./table-skeleton.component.scss"],
})
export class TableSkeletonComponent implements OnInit {
 displayedColumns: string[] = ["symbol", "price", "volume", "priceChange", "quoteVolume", "bidPrice", "askPrice"];
 isLoading = true;

 symbolFilter = "";
 priceFilter = "";
 volumeFilter = "";
 priceChangeFilter = "";
 quoteVolumeFilter = "";
 bidPriceFilter = "";
 askPriceFilter = "";

 constructor(private filterService: FilterService) {}

 ngOnInit(): void {
  this.filterService.filters$.subscribe((filters) => {
   this.symbolFilter = filters.symbol || "";
   this.priceFilter = filters.price || "";
   this.volumeFilter = filters.volume || "";
   this.priceChangeFilter = filters.priceChange || "";
   this.quoteVolumeFilter = filters.quoteVolume || "";
   this.bidPriceFilter = filters.bidPrice || "";
   this.askPriceFilter = filters.askPrice || "";
  });
 }

 resetFilters(): void {
  this.filterService.resetFilters();
 }
}
