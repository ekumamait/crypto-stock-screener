import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockScreenerComponent } from './stock-screener/stock-screener.component';

const routes: Routes = [
  { path: '', component: StockScreenerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
