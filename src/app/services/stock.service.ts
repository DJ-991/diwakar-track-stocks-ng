import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  FINNHUB_TOKEN,
  QuoteResponse,
  QUOTE_URL,
  SENTIMENT_URL,
  StockInfo,
  StockSentiment,
  SentimentInfo,
  SymbolSearchResponse,
  SYMBOL_SEARCH_URL,
} from '../static_data/stock.constants';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  errorHandler = (error) => {
    console.log('Error in service', error);
    return throwError(() => error);
  };
  constructor(private readonly httpClient: HttpClient) {}

  getStockInfo(code: string): Observable<StockInfo> {
    const quoteRequest = this.httpClient
      .get<QuoteResponse>(QUOTE_URL, {
        params: {
          token: FINNHUB_TOKEN,
          symbol: code,
        },
      })
      .pipe(catchError(this.errorHandler));
    const symbolRequest = this.httpClient
      .get<SymbolSearchResponse>(SYMBOL_SEARCH_URL, {
        params: {
          token: FINNHUB_TOKEN,
          q: code,
        },
      })
      .pipe(catchError(this.errorHandler));
    return forkJoin({ quoteInfo: quoteRequest, symbolInfo: symbolRequest });
  }

  getStockSentiment(code: string): Observable<StockSentiment> {
    const date = new Date();
    const from = new Date(date.getFullYear(), date.getMonth() - 3, 1)
      .toISOString()
      .slice(0, 10);
    const to = new Date(date.getFullYear(), date.getMonth(), 0)
      .toISOString()
      .slice(0, 10);
    const sentimentRequest = this.httpClient
      .get<SentimentInfo>(SENTIMENT_URL, {
        params: {
          symbol: code,
          from,
          to,
          token: FINNHUB_TOKEN,
        },
      })
      .pipe(catchError(this.errorHandler));
    const symbolRequest = this.httpClient
      .get<SymbolSearchResponse>(SYMBOL_SEARCH_URL, {
        params: {
          token: FINNHUB_TOKEN,
          q: code,
        },
      })
      .pipe(catchError(this.errorHandler));
    return forkJoin({
      symbolInfo: symbolRequest,
      sentimentInfo: sentimentRequest,
    });
  }
}
