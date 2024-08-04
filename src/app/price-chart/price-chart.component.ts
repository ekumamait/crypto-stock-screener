import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { BinanceService } from '../binance.service';
import { Color } from 'ng2-charts';

@Component({
  selector: 'app-price-chart',
  templateUrl: './price-chart.component.html',
  styleUrls: ['./price-chart.component.css']
})
export class PriceChartComponent implements OnChanges {
  @Input() symbol: string | null = null;

  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{ data: [], label: 'Price History' }]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    { borderColor: '#42A5F5', backgroundColor: 'rgba(66,165,245,0.3)' },
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];

  constructor(private binanceService: BinanceService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['symbol'] && this.symbol) {
      this.fetchPriceHistory(this.symbol);
    }
  }

  fetchPriceHistory(symbol: string): void {
    this.binanceService.getPriceHistory(symbol).subscribe(data => {
      this.lineChartData.labels = data.map((d: any) => new Date(d.T).toLocaleTimeString());
      this.lineChartData.datasets[0].data = data.map((d: any) => d.p);
    });
  }
}
