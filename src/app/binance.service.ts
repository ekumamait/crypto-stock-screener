import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BinanceService {
  private apiUrl = 'https://api.binance.com/api/v3/ticker/24hr';

  constructor(private http: HttpClient) { }

  getCryptos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
