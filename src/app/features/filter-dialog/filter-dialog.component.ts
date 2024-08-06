import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent {
  filterFields = [
    { label: 'Min Trade Volume (USDT)', key: 'minVolume' },
    { label: 'Max Trade Volume (USDT)', key: 'maxVolume' },
    { label: 'Min Price Change (%)', key: 'minPriceChange' },
    { label: 'Max Price Change (%)', key: 'maxPriceChange' },
    { label: 'Min Price (USDT)', key: 'minPrice' },
    { label: 'Max Price (USDT)', key: 'maxPrice' },
  ];

  constructor(
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  onNoClick(): void {
    if (this.data.onCancel) {
      this.data.onCancel();
    }
    this.dialogRef.close();
  }
}
