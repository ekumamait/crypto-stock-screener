import { TestBed } from '@angular/core/testing';

import { BinancewebsocketService } from './binancewebsocket.service';

describe('BinancewebsocketService', () => {
  let service: BinancewebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BinancewebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
