import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BinanceWebSocketService {
  private ws!: WebSocket;
  private url: string = 'wss://stream.binance.com:9443/ws/!ticker@arr';

  constructor(private ngZone: NgZone) {
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    this.ws.onmessage = (message) => {
      this.ngZone.run(() => {
        this.handleMessage(JSON.parse(message.data));
      });
    };

    this.ws.onclose = () => {
      setTimeout(() => this.connect(), 1000);
    };
  }

  private handleMessage(data: any) {
    if (data) {
      this.messageHandler(data);
    }
  }

  public messageHandler: (data: any) => void = (data) => {
    console.log(data);
  };
}
