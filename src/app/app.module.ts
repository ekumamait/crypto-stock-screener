import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { MatPaginatorModule } from "@angular/material/paginator";
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';


import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { StockScreenerComponent } from "./stock-screener/stock-screener.component";
import { FilterDialogComponent } from "./filter-dialog/filter-dialog.component";
import { BinanceService } from "./binance.service";
import { PriceChartComponent } from "./price-chart/price-chart.component";

@NgModule({
 declarations: [AppComponent, StockScreenerComponent, FilterDialogComponent, PriceChartComponent],
 imports: [
  BrowserModule,
  MatSortModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  ReactiveFormsModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatTableModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  FormsModule,
  HttpClientModule,
  MatPaginatorModule,
 ],
 providers: [BinanceService],
 bootstrap: [AppComponent],
})
export class AppModule {}
